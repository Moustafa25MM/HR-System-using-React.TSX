import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './EditAttendance.css';
function EditAttendance() {
  const [status, setStatus] = useState('');
  const { id: attendanceId } = useParams<{ id: string }>();
  let token = localStorage.getItem('token');

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (status !== '') {
      let data = {
        status: status,
      };

      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_BASE_API_URL}attendance/update/${attendanceId}`,
          data,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.status === 200) {
          const employeeId = response.data.employee;
          toast.success('Attendance Updated successfully');
          navigate(`/attendance/employee/` + employeeId);
        }
      } catch (error) {
        toast.error('Failed to update attendance');
      }
    } else {
      toast.error('please select a status');
    }
  };
  return (
    <div className='attendance-status-container'>
      <form onSubmit={handleSubmit} className='attendance-status-form'>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className='attendance-status-select'
        >
          <option value=''>Select status</option>
          <option value='late'>Late</option>
          <option value='present'>Present</option>
          <option value='absent'>Absent</option>
        </select>
        <button type='submit' className='attendance-status-button'>
          Submit
        </button>
      </form>
    </div>
  );
}

export default EditAttendance;
