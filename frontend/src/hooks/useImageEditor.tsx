import { PropsOf } from '@emotion/react'
import { useEffect, useRef, useState } from 'react'
import AvatarEditor, { AvatarEditorProps } from 'react-avatar-editor'
import { ImageEditorDialog } from '../components/ImageEditorDialog'
import { useDialog } from './useDialog'

export const useImageEditor = (
    onSuccess?: (finalImage: { canvasElement: HTMLCanvasElement; url: string; file: Blob | File }) => void
) => {
    const dialogOptions = useDialog()

    const [status, setStatus] = useState<'successful' | 'processing' | 'error' | 'uninitiated'>('uninitiated')

    const editorRef = useRef<AvatarEditor>(null)

    const [sourceImage, setSourceImage] = useState<AvatarEditorProps['image']>()

    const [editedImageData, setEditedImageData] = useState<{
        canvasElement: HTMLCanvasElement
        url: string
        file: File
    }>()

    useEffect(() => {
        return () => {
            setStatus('uninitiated')
            setSourceImage(undefined)
            setEditedImageData(undefined)
        }
    }, [])

    const handleOnEditConfirm = async (canvasElement: HTMLCanvasElement | undefined): Promise<void> => {
        try {
            if (canvasElement === undefined) throw new Error('image cannot be undefined')

            const result: typeof editedImageData = {
                canvasElement,
                url: await getImageAsUrl(canvasElement),
                file: await getImageAsFile(canvasElement),
            }

            setEditedImageData(result)

            setStatus('successful')
        } catch (err) {
            setStatus('error')
            throw err
        } finally {
            setSourceImage(undefined)
        }
    }

    const imageEditroDialogProps: Omit<PropsOf<typeof ImageEditorDialog>, 'sourceImage'> = {
        handleClose: dialogOptions.handleClose,
        dialogOpen: dialogOptions.dialogOpen,
        editorRef,
        handleOnEditConfirm,
    }

    return {
        ...dialogOptions,
        imageEditroDialogProps,
        editorRef,
        onSuccess,
        status,
        sourceImage,
        setSourceImage,
        editedImageData,
        setEditedImageData,
    }
}

const getImageAsUrl = async (canvasElement: HTMLCanvasElement): Promise<string> => {
    const dataUrl = canvasElement.toDataURL()
    const result = await fetch(dataUrl)
    const blob = await result.blob()

    return URL.createObjectURL(blob)
}

const getImageAsFile = async (canvasElement: HTMLCanvasElement): Promise<File> => {
    const dataUrl = canvasElement.toDataURL()
    const result = await fetch(dataUrl)
    const blob = await result.blob()

    return new File([blob], 'upload')
}
