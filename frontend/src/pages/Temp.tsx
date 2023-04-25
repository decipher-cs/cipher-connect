import { Container } from '@mui/system'
import ReactDOM from 'react-dom'
import { useForm, SubmitHandler } from 'react-hook-form'

enum GenderEnum {
    female = 'female',
    male = 'male',
    other = 'other',
}

interface IFormInput {
    firstName: String
    gender: GenderEnum
}

export const Temp = () => {
    const { register, handleSubmit } = useForm<IFormInput>()
    const onSubmit: SubmitHandler<IFormInput> = data => console.log(data)

    return (
        <Container>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>First Name</label>
                <input {...register('firstName')} />
                <input type='submit' />
            </form>
        </Container>
    )
}
