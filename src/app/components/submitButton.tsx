'use client'

import { useFormStatus } from 'react-dom'
import Button from './form-components/button/button'

export function SubmitButton(props: any) {
    const { pending } = useFormStatus()

    return (

            <Button
                id={props.id}
                type="submit"
                text={pending ? 'Loading' : props.text}
            />
    )
}