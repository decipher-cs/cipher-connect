import { useRef, useState } from 'react'
import AvatarEditor, { AvatarEditorProps } from 'react-avatar-editor'
import { useDialog } from './useDialog'

// export const useImageEditor = (originalImgSource: AvatarEditorProps['image']) => {
export const useImageEditor = () => {
    const dialogOptions = useDialog()

    const editorRef = useRef<AvatarEditor>(null)

    const [originalImage, setOriginalImage] = useState<AvatarEditorProps['image']>()

    const [editedImage, setEditedImage] = useState<File | Blob | string>()

    const getImageUrl = async (canvasElement: HTMLCanvasElement) => {
        const dataUrl = canvasElement.toDataURL()
        const result = await fetch(dataUrl)
        const blob = await result.blob()

        return URL.createObjectURL(blob)
    }

    const onSuccess = async (canvasElement: HTMLCanvasElement | undefined): Promise<void> => {
        if (canvasElement === undefined) return

        setEditedImage(await getImageUrl(canvasElement))
    }

    return {
        ...dialogOptions,
        imageEditorProps: {
            handleClose: dialogOptions.handleClose,
            dialogOpen: dialogOptions.dialogOpen,
            originalImgSource: originalImage,
            editorRef,
            onSuccess,
        },
        editorRef,
        onSuccess,
        editedImage,
        originalImage,
        setOriginalImage,
    }
}
