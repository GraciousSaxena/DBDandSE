import axios from 'axios'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Grid, Header, Message, Table } from 'semantic-ui-react'
import HeaderWithAuth from './Header'

class BookTicket extends Component {
  state = { movie: {}, shows: [], showsExist: true, ticketQuantity: 0 }

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

  render() {
    const { currentUser } = this.props
    const { movie, shows, showsExist } = this.state

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
      </>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
})

export default connect(mapStateToProps)(BookTicket)
