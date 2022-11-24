import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pet from '../components/Pet';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useLocation } from 'react-router-dom';

function HomeScreen() {
  let [pets, setPets] = useState([]);
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const query = sp.get('query') || 'all';
  const page = sp.get('page') || 1;

  const fetchData = async ({ type = 'all', page = 1 }) => {
    if (type !== 'all') {
      setLoading(true);
    }
    const { data } = await axios.get(
      type === 'all'
        ? '/api/pets'
        : `/api/pets/search?page=${page}&query=${type}&category=all`
    );
    setLoading(false);
    setPets(type === 'all' ? data : data.pets);
  };
  useEffect(() => {
    if (!localStorage.getItem('userInfo')) {
      navigate('/signin');
    }
  }, []);

  useEffect(() => {
    fetchData({ type: query });
  }, [query]);

  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <h1>Featured Pets</h1>
      <div className="pets">
        {loading && pets.length === 0 ? (
          <LoadingBox />
        ) : (
          <Row>
            {pets.map((pet) => (
              <Col key={pet.slug} sm={6} md={4} lg={3} className="mb-3">
                <Pet pet={pet}></Pet>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
