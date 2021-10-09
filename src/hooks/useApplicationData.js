import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
  });

  const setDay = (day) => setState({ ...state, day });

  function updateSpots(days, apptId, appointments) {
    const findDay = (day) => day.appointments.includes(apptId);
    const singleDay = days.find(findDay);
    let nullAppointments = 0;
    singleDay.appointments.forEach((id) => {
      if (appointments[id].interview === null) {
        nullAppointments++;
      }
    });
    singleDay.spots = nullAppointments;
    return singleDay;
  }

  function bookInterview(id, interview) {
    const appointmentToSave = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    return new Promise((resolve, reject) => {
      //taking the current state, getting all the appointments, and adding the appointment we just saved to the database, updating local state to match the server
      //take the appointments object, saving the interview to the current state, updating the state of appointments
      axios
        .put(`/api/appointments/${id}`, appointmentToSave)

        .then(() => {
          const appointments = {
            ...state.appointments,
            [id]: appointmentToSave,
          };

          setState({
            ...state,
            appointments,
          });

          const newDay = updateSpots(state.days, id, appointments);

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

    return new Promise((resolve, reject) => {
      //taking the current state, getting all the appointments, and removing the appointment from the database
      //take the appointments, saving the interview to the current state, updating the state of appointments
      axios
        .delete(`/api/appointments/${id}`, appointmentToCancel)

        .then(() => {
          const appointments = {
            ...state.appointments,
            [id]: appointmentToCancel,
          };

          setState({
            ...state,
            appointments,
          });

          const newDay = updateSpots(state.days, id, appointments);

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
