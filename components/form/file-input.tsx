import { FileToBlob, cn, getBase64 } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import {
  HTMLAttributes,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'
interface FileInputProps extends HTMLAttributes<HTMLDivElement> {
  onBlobChange?: (url: FileToBlob) => void
  disabled?: boolean
  defaultValue?: any
}

const FileInput = ({
  children,
  disabled = false,
  onBlobChange,
  defaultValue,
  ...rest
}: PropsWithChildren<FileInputProps>) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutate, isLoading } = useMutation(
    ['file-input', FileInput.name],
    async (
      args: Omit<FileToBlob, 'url'> & { file: File }
    ): Promise<FileToBlob> => {
      const { file, ...blob } = args
      const b64 = await getBase64(args.file)
      return {
        ...blob,
        url: b64 as string,
      }
    },
    {
      onSuccess(data) {
        onBlobChange && onBlobChange(data)
      },
    }
  )
  const [preview, setPreview] = useState(defaultValue?.url || '')

  return (
    <div
      {...rest}
      className={cn('relative', rest.className)}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      {children}

      {isLoading ? (
        <div>Loadiing...</div>
      ) : (
        preview && <Image src={preview} alt="preview" fill />
      )}

      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={(event) => {
          if (event.target.files?.[0]) {
            const file = event.target.files?.[0]
            const url = URL.createObjectURL(file)
            setPreview(url)
            mutate({
              name: file.name,
              size: file.size,
              type: file.type,
              file,
            })
          }
        }}
      />
    </div>
  )
}

export default FileInput
