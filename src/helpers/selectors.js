export function getAppointmentsForDay(state, day) {
  //empty result array
  const result = [];
  const filteredDay = state.days.filter(filDay => filDay.name === day)

  if (!filteredDay[0]) {
    return result;
  }

  for (const apptId of filteredDay[0].appointments) {
    result.push(state.appointments[apptId]);
  }

  return result;
}

export function getInterview(state, interview) {
  if (interview===null) {
    return null;
  }
  //interview.interviewer is the id of interviewers, the id 
  const interviewer = state.interviewers[interview.interviewer];
  return { ...interview, interviewer };

}

export function getInterviewersForDay(state, day) {
  //empty result array
  const result = [];
  const filteredDay = state.days.filter(filDay => filDay.name === day)

  if (!filteredDay[0]) {
    return result;
  }

  for (const apptId of filteredDay[0].interviewers) {
    result.push(state.interviewers[apptId]);
  }

  return result;
}