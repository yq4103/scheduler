import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  //combine the state for day, days, and appointments into a state into a single object
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
  });

  //function which updates the state with the new day
  const setDay = (day) => setState({ ...state, day });

  function updateSpots(days, apptId, appointments) {
    const findDay = (day) => day.appointments.includes(apptId);
    const dayObj = days.find(findDay);
    let counterNulls = 0;
    dayObj.appointments.forEach((id) => {
      if (appointments[id].interview === null) {
        counterNulls++;
      }
    });
    dayObj.spots = counterNulls;
    return dayObj;
  }

  function bookInterview(id, interview) {
    const appointmentToSave = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    console.log(id, interview);
    return new Promise((resolve, reject) => {
      //updating the database
      axios
        .put(`/api/appointments/${id}`, appointmentToSave)
        .then(() => {
          //taking the current state, getting all the appointments, and adding the appointment we just saved to the database, updating local state to match the server
          //this is the appointments object which represents the local state
          const appointments = {
            ...state.appointments,
            [id]: appointmentToSave,
          };
          //take the appointments object, saving the interview to the current state, updating the state of appointments
          setState({
            ...state,
            appointments,
          });

          const newDay = updateSpots(state.days, id, appointments);

          // a representation of what we want the state to be
          const daysArray = [...state.days];

          daysArray[newDay.id - 1] = newDay;

          setState((prev) => ({
            ...prev,
            days: daysArray,
          }));

          resolve("success");
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  function cancelInterview(id) {
    const appointmentToCancel = {
      ...state.appointments[id],
      interview: null,
    };

    console.log(id);
    return new Promise((resolve, reject) => {
      //updating the database
      axios
        .delete(`/api/appointments/${id}`, appointmentToCancel)
        .then(() => {
          //taking the current state, getting all the appointments, and removing the appointment from the database
          const appointments = {
            ...state.appointments,
            [id]: appointmentToCancel,
          };
          //take the appointments, saving the interview to the current state, updating the state of appointments
          setState({
            ...state,
            appointments,
          });

          const newDay = updateSpots(state.days, id, appointments);

          // a representation of what we want the state to be
          const daysArray = [...state.days];

          daysArray[newDay.id - 1] = newDay;

          setState((prev) => ({
            ...prev,
            days: daysArray,
          }));

          resolve("success");
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // Hardcoded days array removed so as to fetch axios data instead
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
      console.log(all);
    });
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
