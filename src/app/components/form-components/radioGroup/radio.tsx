export type RadioType = {
    id: string,
    label: string,
    groupName?: string,
    value: string,
    checked?: boolean,
}

export default function Radio(props: RadioType) {

    return (
        <label htmlFor={props.id}>{props.label}
            <input type="radio"
                name={props.groupName}
                id={props.id}
                value={props.value}
                checked={props.checked}
                // onChange: empty function to please React and not get a warning
                onChange={(e) => { }}
            />
        </label>
    )
}