import React, { useState, useEffect } from "react"
import { ErrorInfo } from "../../store/Types"
import { Snackbar } from "react-native-paper"

type Props = {
  error?: ErrorInfo
}

export function ErrorSnack({ error }: Props) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (error) {
      setVisible(true)
    }
  }, [error])

  return (
    <Snackbar
      visible={visible}
      onDismiss={() => {
        setVisible(false)
      }}
    >
      {error?.message}
    </Snackbar>
  )
}
