import React from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import { hasValidDateAndTime } from "../validations/hasValidDateAndTime";

function ReservationsForm({ reservation, setReservation, setReservationErrors }) {
    const history = useHistory();

    function cancelHandler() {
        history.goBack();
    }

//  const submitHandler = async (event) => {
//     event.preventDefault();
//    const abortController = new AbortController();
//    const errors = hasValidDateAndTime(reservation);
//    if (errors.length) {
//         return setReservationErrors(errors);
//     }
//    try {
//        const savedReservation = await createReservation(reservation, abortController.signal);
//        const formattedDate = formatAsDate(savedReservation.reservation_date);
//        console.log("Formatted Date:", formattedDate);
//        history.push(`/dashboard?date=${savedReservation.reservation_date}`);
//     } 
//     catch (error) {
//       setReservationErrors([error]);
//     }
//    return () => abortController.abort();
//     };

const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    console.log("Submitting reservation:", reservation); // Log reservation state
    const validationErrors = hasValidDateAndTime(reservation);
    console.log("Validation errors:", validationErrors); // Log validation errors

    if (Object.keys(validationErrors).length > 0) {
        const errorMessages = Object.values(validationErrors).map(error => error.message || error);
        return setReservationErrors(errorMessages);
    }

    try {
        const savedReservation = await createReservation(reservation, abortController.signal);
        console.log("Saved reservation:", savedReservation); // Log saved reservation
        history.push(`/dashboard?date=${savedReservation.reservation_date}`);
    } catch (error) {
        console.error("Error saving reservation:", error); // Log error
        setReservationErrors([error.response?.data?.error || error.message || "Unknown error occurred."]);
    }

    return () => abortController.abort();
};

function changeHandler(event) {
    const { name, value } = event.target;
    console.log(`Changing ${name} to ${value}`); // Log changes
    setReservation((previousReservation) => ({
        ...previousReservation,
        [name]: name === "people" ? Number(value) : value,
    }));
}
    
return (
    <form onSubmit={submitHandler} className="mb-4">
        <div className="row mb-3">
            <div className="col-6 form-group">
                <label className="form-label" htmlFor="first_name">
                    First Name
                </label>
                <input
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="First Name"
                    pattern="^[a-zA-Z0-9'-. ]+$"
                    value={reservation.first_name}
                    onChange={changeHandler}
                    required={true}
                />
            </div>
            <div className="col-6">
                <label className="form-label" htmlFor="last_name">
                    Last Name
                </label>
                <input
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Last Name"
                    pattern="^[a-zA-Z0-9'-. ]+$"
                    value={reservation.last_name}
                    onChange={changeHandler}
                    required={true}
                />
            </div>
        </div>
        <div className="mb-3">
            <label className="form-label" htmlFor="mobile_number">
                Mobile Number
            </label>
            <input
                className="form-control"
                id="mobile_number"
                name="mobile_number"
                type="text"
                placeholder="Mobile Number"
                pattern="\d{3}-\d{3}-\d{4}"
                value={reservation.mobile_number}
                onChange={changeHandler}
                required={true}
            />
        </div>
        <div className="row mb-3">
            <div className="col-6 form-group">
                <label className="form-label" htmlFor="reservation_date">
                    Reservation Date
                </label>
                <input
                    className="form-control"
                    id="reservation_date"
                    name="reservation_date"
                    type="date"
                    placeholder="YYYY-MM-DD"
                    pattern="\d{4}-\d{2}-\d{2}"
                    value={reservation.reservation_date}
                    onChange={changeHandler}
                    required={true}          
                />
            </div>
            <div className="col-6">
               <label className="form-label" htmlFor="reservation_time">
                    Reservation Time
                </label>
                <input
                    className="form-control"
                    id="reservation_time"
                    name="reservation_time"
                    type="time"
                    placeholder="HH:MM"
                    pattern="\d{2}:\d{2}"
                    value={reservation.reservation_time}
                    onChange={changeHandler}
                    required={true}               
                />
            </div>
        </div>
        <div className="mb-3">
            <label className="form-label" htmlFor="people">
                People
            </label>
            <input  
                className="form-control"
                id="people"
                name="people"
                type="number"
                min= {1}
                value={reservation.people}
                onChange={changeHandler}
                required={true}
            />
        </div>

        <div className="mb-3"> 
            <button         
                type="button" 
                className="btn btn-secondary mr-2"
                onClick={cancelHandler}
            >Cancel
            </button>
          
            <button
                type="submit"
                className="btn btn-primary"
            >Submit
            </button>
        
        </div>    
    </form> 
);

}

export default ReservationsForm;