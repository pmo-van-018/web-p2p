import dayjs from 'dayjs'

export const getDurationWithUnit = (startTime, endTime) => {
  const formatStartTime = dayjs(startTime)
  const formatEndTime = dayjs(endTime)
  if (formatEndTime.diff(formatStartTime, 'day') > 0) {
    return {
      unit: 'day',
      durations: formatEndTime.diff(formatStartTime, 'day')
    }
  }
  if (formatEndTime.diff(formatStartTime, 'hour') > 0) {
    return {
      unit: 'hour',
      durations: formatEndTime.diff(formatStartTime, 'hour')
    }
  }
  if (formatEndTime.diff(formatStartTime, 'minute') > 0) {
    return {
      unit: 'minute',
      durations: formatEndTime.diff(formatStartTime, 'minute')
    }
  }
  return {
    unit: '',
    duration: 0
  }
}

export const getDiffTime = (startTime, endTime) => {
  const mins = dayjs(endTime).diff(dayjs(startTime), 'minutes', true)
  const hours = parseInt(mins / 60)
  const minutes = dayjs().minute(mins).$m
  const seconds = dayjs().second(mins).$m
  return {
    hours,
    minutes,
    seconds
  }
}
