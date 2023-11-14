/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddAttendance.css';
import { useNavigate } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';

function AddAttendance() {
  const [initialDate, setInitialDate] = useState(new Date());
  const [status, setStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { id: employeeId } = useParams<{ id: string }>();
  const [time, setTime] = useState('');

  let token = localStorage.getItem('token');

  const navigate = useNavigate();
  const [value, setValue] = useState(new Date('2014-08-18T21:11:54'));
  const handleChange = (newValue: any) => {
    setValue(newValue);
  };
  const handleTimeChange = (date: Date | any | null) => {
    if (date) {
      const formattedTime = dayjs(date).format('h:mm:A');
      setTime(formattedTime);
      console.log(formattedTime);
    }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const day = initialDate.getDate();
    const month = initialDate.getMonth();
    const year = initialDate.getFullYear();
    const fullDate = `${year}-${month + 1}-${day}`;

    if (status !== '') {
      let data = {
        employeeId: employeeId,
        date: fullDate,
        status: status,
        signInTime: time,
      };

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_API_URL}attendance/create`,
          data,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.status === 201) {
          toast.success('Attendance created successfully');
          navigate(`/attendance/employee/` + employeeId);
        }
      } catch (error) {
        setErrorMessage('Error: Missing data');
        toast.error('Failed to create attendance');
      }
    } else {
      toast.error('please select a status');
    }
  };

  return (
    <div className='attendance-container'>
      {errorMessage && <p>{errorMessage}</p>}
      <div className='attendance-content'>
        <Calendar
          className='attendance-calendar'
          value={initialDate}
          onChange={(date) => date instanceof Date && setInitialDate(date)}
          maxDate={new Date()}
          minDate={new Date(2023, 0, 1)}
        />
        <div style={{ padding: '20px' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['TimePicker']}>
              <TimePicker
                label='With Time Clock'
                value={time}
                onChange={handleTimeChange}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <form onSubmit={handleSubmit} className='attendance-form'>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='attendance-select'
          >
            <option value=''>Select status</option>
            <option value='late'>Late</option>
            <option value='present'>Present</option>
            <option value='absent'>Absent</option>
          </select>
          <input type='submit' value='Submit' className='attendance-submit' />
        </form>
      </div>
    </div>
  );
}

export default AddAttendance;
