import {toast} from "sonner"

export const HomePage = () => {
    toast.success("Bienvenido a la página de inicio", {
        description: "Esta es la página de inicio de la aplicación",
        action: {
            label: "entendido",
            onClick: () => {
                toast.dismiss()
            },
        },
    })
  return (
    <>
      <h1></h1>
    </>
  )
}
