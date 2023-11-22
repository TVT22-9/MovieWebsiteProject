
import { useParams } from 'react-router-dom';

function Testi() {
    const { id } = useParams();
    return (
      <div>
        <h2> {`Hello ! your id: ${id}`}</h2>
      </div>
    );
}
export default Testi;