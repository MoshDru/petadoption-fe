function Rating(props) {
  const { rating, numReviews, caption } = props;
  return (
    <div className="rating">
      <span>
        <i
          className={
            rating >= 1
              ? 'fa fa-paw'
              : rating >= 0.5
              ? 'fas fa-paw-half-alt'
              : 'far fa-paw'
          }
        />
      </span>
      <span>
        <i
          className={
            rating >= 2
              ? 'fa fa-paw'
              : rating >= 1.5
              ? 'fas fa-paw-half-alt'
              : 'far fa-paw'
          }
        />
      </span>
      <span>
        <i
          className={
            rating >= 3
              ? 'fa fa-paw'
              : rating >= 2.5
              ? 'fas fa-paw-half-alt'
              : 'far fa-paw'
          }
        />
      </span>
      <span>
        <i
          className={
            rating >= 4
              ? 'fa fa-paw'
              : rating >= 3.5
              ? 'fas fa-paw-half-alt'
              : 'far fa-paw'
          }
        />
      </span>
      <span>
        <i
          className={
            rating >= 5
              ? 'fa fa-paw'
              : rating >= 4.5
              ? 'fas fa-paw-half-alt'
              : 'far fa-paw'
          }
        />
      </span>
      {caption ? (
        <span>{caption}</span>
      ) : (
        <span>{' ' + numReviews + ' reviews'}</span>
      )}
    </div>
  );
}
export default Rating;
