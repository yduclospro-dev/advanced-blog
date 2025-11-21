export const v2 = {
  uploader: {
    upload: jest.fn().mockResolvedValue({
      url: 'https://mocked.cloudinary.com/test-image.png',
      public_id: 'mocked_id'
    }),
    destroy: jest.fn().mockResolvedValue({ result: 'ok' })
  },
  config: jest.fn()
};
