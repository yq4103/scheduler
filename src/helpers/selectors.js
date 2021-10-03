export function getAppointmentsForDay(state, day) {
  //empty resut array
  const result = [];
  //the find method returns the value of the first element in the array that satisfies the condition
  //to find within the days array the object with a name key whose value equals the day specified
  const filteredDay = state.days.find(apptDay => apptDay.name === day)
  //If there are no appointments on the given day, our days data will be empty, return an empty array
  if (!filteredDay) {
    return result;
  }
  //the value of the appointment key of the days object is an array of appointments ids, iterate through the array and push the corresponding appointments object to the result array 
  for (const apptId of filteredDay.appointments) {
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
  //empty resut array
  const result = [];
  //the find method returns the value of the first element in the array that satisfies the condition
  //to find within the days array the object with a name key whose value equals the day specified
  const filteredDay = state.days.find(apptDay => apptDay.name === day)
  //If there are no appointments on the given day, our days data will be empty, return an empty array
  if (!filteredDay) {
    return result;
  }
  //the value of the appointment key of the days object is an array of appointments ids, iterate through the array and push the corresponding appointments object to the result array 
  for (const apptId of filteredDay.appointments) {
    result.push(state.appointments[apptId]);
  }

  return result;
}