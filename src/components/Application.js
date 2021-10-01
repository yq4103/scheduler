import React, { useState, useEffect } from "react";

import axios from "axios";

import "components/Application.scss";

import DayList from "./DayList";

import Appointment from "components/Appointment";

// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm",
//   },
//   {
//     id:4,
//     time: "3pm",
//     interview: {
//       student: "Zoey Qin",
//       interviewer: {
//         id: 6,
//         name: "林巾帼",
//         avatar: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/760.png",
//       }
//     }
//   }
// ];

export default function Application(props) {
  const parsedAppointment = appointments.map(appointment  => 
    <Appointment  key={appointment.id} {...appointment}/>);
  //combine the state for day, days, and appointments into a state into a single object
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const dailyAppointments = [];
  
  //function which updates the state with the new day
  const setDay = day => setState({ ...state, day });
  const setDays = (days) => {
    setState(prev => ({ ...prev, days }));
  }

  // Hardcoded days array removed so as to fetch axios data instead
  useEffect(() => {
    axios.get("/api/days").then(response=> {
      setDays(response.data)
    })
  }, []);
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
        {parsedAppointment}
        <Appointment key="last" time="7pm" />
      </section>
    </main>
  );
}
