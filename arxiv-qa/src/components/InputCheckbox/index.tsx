import classNames from "classnames"
import { useRef } from "react"
import { InputCheckboxComponent } from "./types"

export const InputCheckbox: InputCheckboxComponent = ({ id, checked = false, disabled, onChange }) => {
  const { current: inputId } = useRef(`RampInputCheckbox-${id}`)

  // toogle checkbox
  const toogleCheckbox = () => {
    if (!disabled) onChange(!checked)
  }
  return (
    <div className="RampInputCheckbox--container" data-testid={inputId}>
      <label
        className={classNames("RampInputCheckbox--label", {
          "RampInputCheckbox--label-checked": checked,
          "RampInputCheckbox--label-disabled": disabled,
        })}
        onClick={toogleCheckbox}
      />
      <input
        id={inputId}
        type="checkbox"
        className="RampInputCheckbox--input"
      />
    </div>
  )
}
