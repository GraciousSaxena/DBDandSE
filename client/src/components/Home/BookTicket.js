import axios from 'axios'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Table,
} from 'semantic-ui-react'
import HeaderWithAuth from './Header'
import Rating from './Rating'

class BookTicket extends Component {
  state = {
    movie: {},
    shows: [],
    showsExist: true,
    ticketQuantity: 0,
    isReviewPermitted: false,
    isReviewToggled: false,
    rating: 5,
    review: '',
    reviews: [],
    errors: [],
    loading: false,
  }

  componentDidMount() {
    const movieId = this.props.location.pathname.split('/')[2]

    axios
      .get(`http://localhost:6969/movie/${movieId}`)
      .then(res => {
        this.setState({ movie: res.data[0] })
      })
      .catch(err => console.error(err))

    axios.get(`http://localhost:6969/movie/shows/${movieId}`).then(res => {
      if (res.data === 'No shows currently') {
        this.setState({ showsExist: false })
      } else {
        this.setState({ shows: res.data })
      }
    })

    axios.get(`http://localhost:6969/reviews/${movieId}`).then(res => {
      if (res.data.length > 0) {
        this.setState({ reviews: res.data })
      }
    })
  }

  displayShows = shows =>
    shows.map(show => (
      <Table.Row key={show.id}>
        <Table.Cell>
          <Link to={`/show/${show.id}`}>
            {show.day.toString() +
              '-' +
              show.month.toString() +
              '-' +
              show.year.toString()}
          </Link>
        </Table.Cell>

        <Table.Cell>{show.ticketPrice}</Table.Cell>

        <Table.Cell>
          {show.ticketCount > 0 ? `${show.ticketCount}` : 'Sold Out'}
        </Table.Cell>
      </Table.Row>
    ))

  displayReviews = reviews =>
    reviews.map(review => (
      <Table.Row>
        <Table.Cell>{review.review}</Table.Cell>
        <Table.Cell>
          <Rating value={review.rating} color="teal" />
        </Table.Cell>
      </Table.Row>
    ))

  toggleReviews = e => {
    this.setState({ isReviewToggled: !this.state.isReviewToggled })

    axios
      .post('http://localhost:6969/check', {
        movieId: this.state.movie.id,
        email: this.props.currentUser.email,
      })
      .then(({ data }) => {
        if (data === 'Allowed') {
          this.setState({ isReviewPermitted: true })
        }
      })
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleRatingChange = e => {
    this.setState({ [e.target.name]: parseInt(e.target.value, 10) })
  }

  isFormEmpty = ({ review }) => {
    return !review.length
  }

  isRatingValid = ({ rating }) => {
    return rating >= 1 && rating <= 5
  }

  isFormValid = () => {
    let error
    let errors = []

    if (this.isFormEmpty(this.state)) {
      error = {
        message: 'Please fill out all fields!!!',
      }
      this.setState({ errors: errors.concat(error) })
      return false
    } else if (!this.isRatingValid(this.state)) {
      error = { message: 'Enter an appropriate rating' }
      this.setState({ errors: errors.concat(error) })
      return false
    } else {
      return true
    }
  }

  handleSubmit = e => {
    e.preventDefault()

    if (this.isFormValid()) {
      this.setState({ loading: true, errors: [] })

      axios
        .post('http://localhost:6969/reviews/add', {
          movieId: this.state.movie.id,
          email: this.props.currentUser.email,
          rating: this.state.rating,
          review: this.state.review,
          effecRating: Math.floor(this.state.rating * 0.9),
        })
        .then(res => {
          console.log(res)
          this.setState({ isReviewPermitted: false, loading: false })
        })
    }
  }

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>)

  render() {
    const { currentUser } = this.props
    const {
      movie,
      shows,
      showsExist,
      rating,
      review,
      reviews,
      isReviewPermitted,
      isReviewToggled,
      errors,
      loading,
    } = this.state

    return (
      <>
        <HeaderWithAuth currentUser={currentUser} />

        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 600 }}>
            <Header as="h2">{movie.name}</Header>
            <p>
              <strong>Description: </strong>
              {movie.description}
            </p>
          </Grid.Column>
        </Grid>

        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 1000 }}>
            {showsExist ? (
              <Table celled textAlign="center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Show Date</Table.HeaderCell>

                    <Table.HeaderCell>Ticket Price</Table.HeaderCell>

                    <Table.HeaderCell>Tickets Left</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>{this.displayShows(shows)}</Table.Body>
              </Table>
            ) : (
              <Message info>No Shows as of now... Stay in touch</Message>
            )}
          </Grid.Column>
        </Grid>

        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column>
            <Button size="small" color="black" onClick={this.toggleReviews}>
              Show Reviews
            </Button>
            {isReviewPermitted && (
              <Grid textAlign="center" verticalAlign="middle">
                <Grid.Column style={{ maxWidth: 600 }}>
                  <Header as="h4">Write review</Header>
                  <Segment stacked>
                    <Form size="small" onSubmit={this.handleSubmit}>
                      <Form.Input
                        name="rating"
                        value={rating}
                        label="Enter your rating"
                        onChange={this.handleRatingChange}
                        type="number"
                      />

                      <Message info>
                        This should be an integer between 1 and 5
                      </Message>

                      <Form.TextArea
                        name="review"
                        value={review}
                        label="Write your review"
                        onChange={this.handleChange}
                        type="text"
                      />
                      <Button
                        size="small"
                        color="black"
                        className={loading ? 'loading' : ''}
                      >
                        Submit Review
                      </Button>
                    </Form>
                  </Segment>
                  {errors.length && (
                    <Message error>{this.displayErrors(errors)}</Message>
                  )}
                </Grid.Column>
              </Grid>
            )}
            {isReviewToggled && (
              <Table celled textAlign="center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Review</Table.HeaderCell>
                    <Table.HeaderCell>Rating</Table.HeaderCell>
                  </Table.Row>
                  {}
                </Table.Header>
                <Table.Body>
                  {reviews.length > 0 ? this.displayReviews(reviews) : <></>}
                </Table.Body>
              </Table>
            )}
          </Grid.Column>
        </Grid>
      </>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
})

export default connect(mapStateToProps)(BookTicket)
