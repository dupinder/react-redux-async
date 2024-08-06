import { uiActions } from "./ui-slice";
import API_URL from '../appConfig';
import { cartActions } from "./cartSlice";

export const sendCartData = (cart) => {
    return async (dispatch) => {
        
      dispatch(uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data!',
      }));

      const sendRequest = async () => {
        const response = await fetch(`${API_URL}/cart.json`, {
            method: 'PUT',
            body: JSON.stringify(cart),
        });

        if (!response.ok) {
            throw new Error('Sending cart data failed.');
        }

        const responseData = await response.json();

        dispatch(uiActions.showNotification({
            status: 'success',
            title: 'Success!',
            message: 'Sent cart data successfully!',
        }));
      };
     
      try {
            await sendRequest();
        }
        catch(error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error!',
                message: 'Sending cart data failed!',
            }));
        } 
    }
}


export const fetchCartData = () => {
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await fetch(`${API_URL}/cart.json`);

            if (!response.ok) {
                throw new Error('Could not fetch cart data!');
            }

            const data = await response.json();
            return data;
        }

        try {
            const cartData = await fetchData();
            dispatch(cartActions.replaceCart({
                items: cartData.items || [],
                totalQuantity: cartData.totalQuantity || 0,
                totalAmount: cartData.totalAmount || 0,
                isChanged: false
            }));
        } catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error!',
                message: 'Fetching cart data failed!',
            }));
        }
    }
}