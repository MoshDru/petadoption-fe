import axios from 'axios';
import { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
// import Rating from './Rating';

function Pet(props) {
  const { pet } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    adoptionBasket: { adoptionBasketItems },
  } = state;

  const addToAdoptionBasketHandler = async (item) => {
    const existItem = adoptionBasketItems.find((x) => x._id === pet._id);
    const quantity = existItem ? existItem.quantity = 1 : 1;
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

  // const addToFosterBasketHandler = async (item)  => {
  //   const data = await axios.get(`/api/pets/${item._id}`)
  //   ctxDispatch({
  //     type: 'SAVED_ADD_ITEM',
  //     payload: { ...item, quantity },
  //   });
  // }

  return (
    <Card>
      <Link to={`/pet/${pet.slug}`}>
        <img src={pet.image} className="card-img-top" alt={pet.name} />
      </Link>
      <Card.Body>
        <Link to={`/pet/${pet.slug}`}>
          <Card.Title>{pet.name}</Card.Title>
        </Link>
        {/* <Rating rating={pet.rating} numReviews={pet.numReviews} />
        <Card.Text>${pet.price}</Card.Text> */}
        {/* <Card.Text>{pet.type}</Card.Text>
        <Card.Text>{pet.adoptionStatus}</Card.Text>
        <Card.Text>{pet.height}</Card.Text>
        <Card.Text>{pet.weight}</Card.Text>
        <Card.Text>{pet.description}</Card.Text>
        <Card.Text>{pet.hypoallergenic}</Card.Text>
        <Card.Text>{pet.dietaryRestrictions}</Card.Text>
        <Card.Text>{pet.breed}</Card.Text> */}
        {pet.countInShelter === 0 ? (
          <Button variant="light" disabled>
            Pet already adopted
          </Button>
        ) : (
          <Button onClick={() => addToAdoptionBasketHandler(pet)}>
            Adopt 
          </Button>
        )}
         {/* <Button onClick={() => addToFosterBasketHandler(pet)}>
            Foster
          </Button> */}
          {/* <Button>
            Save
          </Button> */}
      </Card.Body>
    </Card>
  );
}

export default Pet;
