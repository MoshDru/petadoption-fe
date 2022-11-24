import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Pet from '../components/Pet';
import Rating from '../components/Rating';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        pets: action.payload.pets,
        page: action.payload.page,
        pages: action.payload.pages,
        countPets: action.payload.countPets,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const sp = new URLSearchParams(search);
  const query = sp.get('query') || 'all';
  const page = sp.get('page') || 1;

  const getPetType = async () => {
    const { data } = await axios.get(
      `/api/pets/search?page=${page}&query=all&category=all`
    );
    console.log(data, 'data');
    await dispatch({ type: 'FETCH_SUCCESS', payload: data });
  };

  useEffect(() => {
    getPetType();
  }, []);

  const [{ loading, error, pets, pages, countPets }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
    }
  );
  console.log(pets, 'pets');

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/pets/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  return (
    <div>
      <Helmet>
        <title>Search Pets</title>
      </Helmet>
      <Row>
        <Col md={9}>
          {loading ? (
            <div></div>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>{pets.length === 0 && <MessageBox>No Pet Found</MessageBox>}</>
          )}
        </Col>
      </Row>
    </div>
  );
}
