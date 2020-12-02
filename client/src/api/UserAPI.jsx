import React from "react";
import axios from "axios";

export const UserAPI = (token) => {
    const [isLogged, setIsLogged] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [cart, setCart] = React.useState([]);
    const [history, setHistory] = React.useState([]);

    const URL = "http://localhost:9000/api"

    React.useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get(`${URL}/user/infor`, {
                        headers: {Authorization: token}
                    })
                    setIsLogged(true);
                    if (res.data.role === 1) {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                    setCart(res.data.cart);
                } catch (error) {
                    console.log(error.response.data.msg);
                }
            }
            getUser();
        }
    }, [token]);

    const addCart = async (product) => {
        if (!isLogged) {
            return alert("Please login to make a purchase.");
        };
        const check = cart.every((item) => {
            return item._id !== product._id
        })
        if (check) {
            setCart([...cart, {...product, quantity: 1}])
            await axios.patch(`${URL}/user/addcart`, {
                cart: [...cart, {...product, quantity: 1}]
            }, {headers: {Authorization: token}})
        } else {
            alert("This product has been added to cart.");
        }
    };

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        addCart: addCart,
        history: [history, setHistory]
    }
};


