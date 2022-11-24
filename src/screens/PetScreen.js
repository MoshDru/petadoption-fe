import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { getError } from '../utils';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, pet: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function PetScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, pet }, dispatch] = useReducer(reducer, {
    pet: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/pets/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { adoptionBasket } = state;
  const addToAdoptionBasketHandler = async () => {
    const existPet = adoptionBasket.adoptionBasketItems.find(
      (x) => x._id === pet._id
    );
    const quantity = existPet ? existPet.quantity = 1 : 1;
    const { data } = await axios.get(`/api/pets/${pet._id}`);
    if (data.countInShelter < quantity) {
      window.alert('Sorry, this pet has already been adopted');
      return;
    }
    ctxDispatch({
      type: 'ADOPTIONBASKET_ADD_ITEM',
      payload: { ...pet, quantity },
    });
    navigate('/adoptionBasket');
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img className="img-large" src={pet.image} alt={pet.name}></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                Name<title>{pet.name}</title>
              </Helmet>
            </ListGroup.Item>
            <ListGroup.Item>
              Description : <p>{pet.description}</p>
            </ListGroup.Item>
            {/* <ListGroup.Item>
              Type : <p>{pet.type}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              Adoption Status: <p>{pet.adoptionStatus}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              Height : <p>{pet.height}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              Weight : <p>{pet.weight}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              Hypoallergenic : <p>{pet.hypoallergenic}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              Dietary Restrictions : <p>{pet.dietaryRestrictions}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              Breed : <p>{pet.breed}</p>
            </ListGroup.Item> */}
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {pet.countInShelter > 0 ? (
                        <Badge bg="success">Available</Badge>
                      ) : (
                        <Badge bg="danger">Adopted</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {pet.countInShelter > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        onClick={addToAdoptionBasketHandler}
                        variant="primary"
                      >
                        Adopt
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PetScreen;
