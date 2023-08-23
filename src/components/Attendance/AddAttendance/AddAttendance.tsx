import axios from 'axios';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddAttendance.css';
import { useNavigate } from 'react-router-dom';

function AddAttendance() {
  const [initialDate, setInitialDate] = useState(new Date());
  const [status, setStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { id: employeeId } = useParams<{ id: string }>();

  let token = localStorage.getItem('token');

  const navigate = useNavigate();

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
