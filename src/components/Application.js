import React, { useState, useEffect } from "react";

import axios from "axios";

import "components/Application.scss";

import DayList from "./DayList";

import Appointment from "components/Appointment";

import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {
  //combine the state for day, days, and appointments into a state into a single object
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
  const schedule = dailyAppointments.map((appointment)  => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  //function which updates the state with the new day
  const setDay = day => setState({ ...state, day });
  const setDays = (days) => {
    setState(prev => ({ ...prev, days }));
  }

  // Hardcoded days array removed so as to fetch axios data instead
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      setState(prev => ({...prev, days:all[0].data, appointments:all[1].data, interviewers:all[2].data }))
      console.log(all)
    })
    
  }, []);

  function bookInterview(id, interview) {
    const appointmentToSave = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    console.log(id, interview);
    return new Promise((resolve, reject) => {
      //updating the database
      axios.put(`/api/appointments/${id}`, appointmentToSave)
      .then(() => {
        //taking the current state, getting all the appointments, and adding the appointment we just saved to the database
        const appointments = {
          ...state.appointments,
          [id]: appointmentToSave
        };
        //take the appointments, saving the interview to the current state, updating the state of appointments
        setState({
          ...state,
          appointments
        });
        resolve ('success')
      })
      .catch((err) => {
        reject (err)
      })
    })
  }

  function cancelInterview(id) {
    const appointmentToCancel = {
      ...state.appointments[id],
      interview: null
    };

    console.log(id);
    return new Promise((resolve, reject) => {
      //updating the database
      axios.delete(`/api/appointments/${id}`, appointmentToCancel)
      .then(() => {
        //taking the current state, getting all the appointments, and removing the appointment from the database
        const appointments = {
          ...state.appointments,
          [id]: appointmentToCancel
        };
        //take the appointments, saving the interview to the current state, updating the state of appointments
        setState({
          ...state,
          appointments
        });
        resolve ('success')
      })
      .catch((err) => {
        reject (err)
      })
    })
  }

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList day={state.day} days={state.days} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="7pm" />
      </section>
    </main>
  );
}
