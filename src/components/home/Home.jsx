import React, { Fragment, useEffect, useState } from "react";
import { Form, Formik, Field, ErrorMessage } from "formik";
import {useAuthHeader} from 'react-auth-kit'
import axios from "axios";
import Modal from 'react-modal';
import { customStyles, crustOptions, flavorOptions, sizeOptions, filterOptions } from "../../utils/modal-configs";
import * as Yup from 'yup'
import './Home.css';

//TODO: Breakout Modals into seperate components

const Home = () => {
    const [responseMessage, setResponse] = useState("");
    const [orders, setOrders] = useState([])
    const [displayOrders, setDisplay] = useState([])
    const [filterString, setFilterString] = useState("")
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modal2IsOpen, setIsOpen2] = useState(false);
    const [deleteId, setDeleteID] = useState(null)
    const [filterOption, setFilterOption] = useState("")
    const authHeader = useAuthHeader();
    const headerConfig = {
        headers: {Authorization: authHeader()}
    }


      const OrderSchema = Yup.object().shape({
        Crust: Yup.string()
        .required('Required'),
        Flavor: Yup.string()
        .required('Required'),
        Size: Yup.string()
        .required('Required'),
        Table_No: Yup.number()
        .min(1, "Enter a Valid Table Number" )
        .max(20, "There are only 20 Tables in the resteraunt")
        .required('Required')
      });

/*************************************
 * 
 * Hooks
 * 
 * 
 ***********************************/
    useEffect(()  => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    "https://pizza-api-app.herokuapp.com/api/orders"
                );
                setOrders(response.data)
                setDisplay(response.data)
            } catch (err) {
                setResponse("Error Retrieving Orders")
                console.log(err);
            }
        }
        fetchOrders();
        
    }, [])

    //update displayed list if orders or filterstring is updated
    useEffect(() => {
        const filterOrderList = () => {
            if(filterString.length>0) {
                setDisplay(
                    orders.filter((order) => (filterString == order.Order_ID && filterOption === filterOptions[3]) || 
                        (filterString == order.Table_No && filterOption === filterOptions[4]) || 
                        (order.Crust.toLowerCase().includes(filterString.toLowerCase()) && filterOption === filterOptions[0]) || 
                        (order.Flavor.toLowerCase().includes(filterString.toLowerCase()) && filterOption === filterOptions[1]) || 
                        (order.Size.toLowerCase().includes(filterString.toLowerCase()) && filterOption === filterOptions[2]) || 
                        (order.Timestamp.toLowerCase().includes(filterString.toLowerCase()) && filterOption === filterOptions[5]))
                )
            } else {
                setDisplay(orders);
            }
            
        }
        
        filterOrderList();

    },[filterString, orders, filterOption])

    //clear message banner after set
    useEffect(() => {
        if(responseMessage.length>0) {
            clearBanner();
        }
    },[responseMessage])

    //update displayed list if orders or filterstring is updated
    useEffect(() => {
        if(deleteId) {
            setIsOpen2(true);
        }

    },[deleteId])



/*************************************
 * 
 *  Modal Open and close functionality
 * 
 * 
 ***********************************/
    const clearBanner = async () => {
        setTimeout(() => {setResponse("")},5000)
    }

    const openPlaceOrderModal = () => {
        setIsOpen(true);
    }
    const afterOpenModal = () => {
    }
    
    const closePlaceOrderModal = () => {
        setIsOpen(false);
    }
    const openRemoveOrderModal = (id) => {
        setDeleteID(id)
        setIsOpen2(true);
    }
    
    const closeRemoveOrderModal = () => {
        setIsOpen2(false);
    }


/*************************************
 * 
 *  Order Modal Functionality
 * 
 * 
 ***********************************/
    const removeOrder = async (id) => {
        //Reset error on resubmit
        setResponse("");

        try {
            const response = await axios.delete(
                `https://pizza-api-app.herokuapp.com/api/orders/${id}`
            );
            //If successful filter out deleted id 
            setOrders(orders.filter(order => order.Order_ID !== id))
            setDeleteID(null)
            setIsOpen2(false)
            setResponse(`Successfully removed order #${id}`)
        } catch (err) {
            setResponse("Failed to remove order")
            setIsOpen2(false)
            console.log(err);
        }

    }

    const onSubmit = async (values) => {
        //Reset error on resubmit
        setResponse("");

        console.log(values)

        try {
            const response = await axios.post(
                "https://pizza-api-app.herokuapp.com/api/orders", 
                {values},headerConfig
            );
            // If successful add to orders array 
            setOrders([...orders,response.data])
              setResponse(`Successfully placed order`)
              closePlaceOrderModal()
        } catch (err) {
            setResponse("Failed to submit order")
            closePlaceOrderModal()
            console.log(err);
        }
    }

/*************************************
 * 
 *  JSX Helpers
 * 
 * 
 ***********************************/
    const renderRadioButtons = (list) => {
        let orderList = list.map((item, index) => <option key = {index} value={item}>{item}</option>)
        return orderList
    }

    const renderOrderList = () => {
        let orderList = displayOrders.map(order => {
            return (
                <div key={order.Order_ID} className="order-items">
                    <p>
                        Order Number: {order.Order_ID}<br/>
                        Crust: {order.Crust}<br/>
                        Flavor: {order.Flavor}<br/>
                        Size: {order.Size}<br/>
                        Table Number: {order.Table_No}<br/>
                        Order Date: {order.Timestamp}<br/>
                    </p>
                    <button className="button" onClick={() =>openRemoveOrderModal(order.Order_ID)}>Remove Order</button>
                </div>
            )
        })
        return orderList
    }

/*************************************
 * 
 * Search Functionality
 * 
 * 
 ***********************************/
    const onSearch = async (values) => {
        //Reset error on resubmit
        setFilterString(values.search);
        setFilterOption(values.filterOption)

    }
    const renderFilterOptions = () => {
        return filterOptions.map(option => <option key={option}value={option}>{option}</option>)
    }

/*************************************
 * 
 * Rendering JSX
 * 
 * 
 ***********************************/
    return (
        <div className="home-body">
            {responseMessage.length>0? <p className = "message-banner">{responseMessage}</p>:null}
            <button className="button" onClick={openPlaceOrderModal}>Create Order</button>
            {/* Modal For Removing Orders */}
            <Modal
                isOpen={modal2IsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeRemoveOrderModal}
                style={customStyles}
                contentLabel="Remove Modal"
                ariaHideApp={false}
            >
                <button onClick={closeRemoveOrderModal}>close</button>
                <h1>Are you sure you want to remove Order Number {deleteId}</h1>
                <button className="button" type="submit" onClick={() =>{removeOrder(deleteId)}}>Remove Order</button>
                
            </Modal>
            {/* Modal For Placing Orders */}
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closePlaceOrderModal}
                style={customStyles}
                contentLabel="Order Modal"
                // placing to remediate app element in unit testing
                ariaHideApp={false}
            >
                <button onClick={closePlaceOrderModal}>close</button>
                <h1>Customize Your Pizza</h1>

                {/* Form For Placing Orders */}
                <Formik
                initialValues= {{
                    Crust: crustOptions[0],
                    Flavor: flavorOptions[0],
                    Size: sizeOptions[0],
                    Table_No: 0
                }}
                onSubmit = {values => {onSubmit(values)}}
                validationSchema={OrderSchema}
                >
                    {({ errors, touched }) => (
                    <Form className="order">
                        <span>Crust:   </span>
                        <Field as="select" name="Crust">{renderRadioButtons(crustOptions)} </Field>
                        <ErrorMessage name="Crust" /><br/>
                        <span>Flavor:   </span>
                        <Field as="select" name="Flavor">{renderRadioButtons(flavorOptions)} </Field>
                        <ErrorMessage name="Flavor" /><br/>
                        <span>Size:   </span>
                        <Field as="select" name="Size">{renderRadioButtons(sizeOptions)} </Field>
                        <ErrorMessage name="Size" /><br/>
                        <span>Table:   </span>
                        <Field  name="Table_No"/>
                        <ErrorMessage name="Table_No" /><br/>
                        <button className="button" type="submit">Submit</button>
                    </Form>
                    )}
                    
                </Formik>
            </Modal>
            {/* Form to search Order List */}
            <div className="order-list">
                <h1>Your Orders</h1>
                <Formik
                initialValues= {{
                    search: "",
                    filterOption: "Crust"
                }}
                onSubmit = {values => {onSearch(values)}}
                >
                    <Form className="search">
                        <Field as="select" name="filterOption">
                            {renderFilterOptions()}
                        </Field>
                        <Field className="input" name="search" placeholder="Search"  />
                        <button className="button" type="submit">Search</button>
                    </Form>
                </Formik>
                {/* Display Order List from State */}
                {renderOrderList()}

            </div>
        </div>
    )

}

export default Home