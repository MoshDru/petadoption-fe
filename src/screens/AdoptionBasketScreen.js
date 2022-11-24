import axios from 'axios';
import { useContext } from 'react';
import {
  Button,
  Card,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';

export default function AdoptionBasketScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    adoptionBasket: { adoptionBasketItems },
  } = state;

  const updateAdoptionBasketHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/pets/${item._id}`);
    if (data.countInShelter < quantity) {
      window.alert('Sorry, this pet has already been adopted');
      return;
    }
    ctxDispatch({
      type: 'ADOPTIONBASKET_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'ADOPTIONBASKET_REMOVE_ITEM', payload: item });
  };

  return (
    <div>
      <Helmet>
        <title>My Adopted Pets</title>
      </Helmet>
      <h1>My Adopted Pets</h1>
      <Row>
        <Col md={8}>
          {adoptionBasketItems.length === 0 ? (
            <MessageBox>
              Your pet adoption basket is empty. <Link to="/">Find A Pet!</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {adoptionBasketItems.map((item) => (
                <ListGroupItem key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/pet/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="light"
                      >Unadopt pet
                        <i className="fas fa-paw"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
        </Col>
      </Row>
    </div>
  );
}
