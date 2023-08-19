import * as z from 'zod'
const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export const uploadValidation = z.object({
  image: z.any().refine((v) => {
    return !!v[0]
  }, '이미지는 필수입니다.'),
})