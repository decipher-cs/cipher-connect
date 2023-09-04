export const arrayBufferToObjectUrlConverter = (buffer: ArrayBuffer | null, MIMEType: string) => {
    if (buffer === null) return ''
    const [fileType, fileExtention] = MIMEType.split('/')
    const file = new File([buffer], crypto.randomUUID(), { type: fileExtention })
    return URL.createObjectURL(file)
}
