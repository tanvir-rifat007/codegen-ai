import { createContext, use, useState } from "react"

const Context = createContext({
    user: {},
    setUser: () => { },
    handleSubmit: () => { }

})

export const CartContext = ({ children }) => {
    const [user, setUser] = useState({})


    const handleSubmit = async (e, setToast, setIsSubmitting, validateForm) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formDataObj = new FormData(e.target);
        const email = formDataObj.get("email");
        const password = formDataObj.get("password");

        setIsSubmitting(true);

        async function postUserData() {
            const response = await fetch("/api/users/authenticate", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return response.json();
        }

        try {
            const data = await postUserData();
            console.log(data);

            if (data.user) {
                setUser({
                    ...user,
                    ...data.user,

                })

                setToast({ message: "✅ Account created successfully and please verify your email before login!", type: "success" });
            } else {
                setToast({ message: `⚠️ ${data.error.email}`, type: "error" });
            }
        } catch (err) {
            console.error(err);
            setToast({ message: "❌ Something went wrong!", type: "error" });
        } finally {
            setTimeout(() => setToast(null), 2000);
            setIsSubmitting(false);
        }
    };




    const value = { user, handleSubmit, setUser };




    return (
        <Context.Provider value={value}>{children}</Context.Provider>
    )
}

export const useCart = () => use(Context)


