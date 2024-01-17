export type RadioType = {
    id: string,
    label: string,
    groupName?: string,
    value: string,
    checked?: boolean | undefined,
}

export default function Radio(props:RadioType) {

    return (
        <label htmlFor={props.id}>{props.label}
        <input type="radio"
                name={props.groupName}
                id={props.id}
                value={props.value}
                defaultChecked={props.checked}
                />
      </label>
    )
}