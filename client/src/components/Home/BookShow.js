import axios from 'axios'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import HeaderWithAuth from './Header'

class BookShow extends Component {
  state = {
    show: {},
    refCount: 0,
    empId: 0,
    ticketQty: 0,
    refPrice: 0,
    refTotalPrice: 0,
    ticketTotalPrice: 0,
    totalPrice: 0,
    employees: [],
    projEmpId: 0,
    loading: false,
    errors: [],
    bookingDone: false,
  }

  componentDidMount() {
    const showId = this.props.location.pathname.split('/')[2]

    axios.get(`http://localhost:6969/show/${showId}`).then(res => {
      console.log(res)
      this.setState({ show: res.data[0], refPrice: 250 })
    })

    axios.get('http://localhost:6969/employees').then(res => {
      console.log(res)
      this.setState({ employees: res.data })
      this.setState({
        projEmpId: this.state.employees[
          Math.floor(Math.random() * this.state.employees.length + 1) - 1
        ].id,
      })
    })
  }

  isFormEmpty = ({ ticketQty }) => {
    return ticketQty === 0
  }

  isTicketCountValid = ({ show, ticketQty }) => {
    return ticketQty <= show.ticketCount
  }

  isFormValid = () => {
    let error
    let errors = []

    if (this.isFormEmpty(this.state)) {
      error = { message: 'Please fill out all fields' }
      this.setState({ errors: errors.concat(error) })
      return false
    } else if (!this.isTicketCountValid(this.state)) {
      error = { message: "There aren't as many tickets" }
      this.setState({ errors: errors.concat(error) })
      return false
    } else {
      return true
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: parseInt(e.target.value, 10) })
  }

  handleSubmit = e => {
    e.preventDefault()

    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true })
      this.setState({
        ticketTotalPrice: this.state.ticketQty * this.state.show.ticketPrice,
        refTotalPrice: this.state.refCount * this.state.refPrice,
      })
      this.setState({
        totalPrice:
          this.state.ticketQty * this.state.show.ticketPrice +
          this.state.refCount * this.state.refPrice,
      })

      axios
        .put('http://localhost:6969/show/book', {
          showId: this.state.show.id,
          ticketSold: this.state.ticketQty,
        })
        .then(res => {
          console.log(res.data)
        })

      axios
        .put('http://localhost:6969/movies/book', {
          movieId: this.state.show.movieId,
          profit:
            this.state.ticketQty * this.state.show.ticketPrice +
            this.state.refCount * this.state.refPrice,
          projProfit:
            this.state.ticketQty * this.state.show.ticketPrice +
            this.state.refCount * this.state.refPrice +
            Math.floor(
              this.state.ticketQty * this.state.show.ticketPrice +
                this.state.refCount * this.state.refPrice * 0.15
            ),
        })
        .then(res => {
          console.log(res.data)
        })

      axios
        .post('http://localhost:6969/watched', {
          movieId: this.state.show.movieId,
          email: this.props.currentUser.email,
          empId: this.state.projEmpId,
        })
        .then(res => {
          console.log(res.data)
        })

      this.setState({ loading: false, bookingDone: true })
      console.log(this.state)
    }
  }

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>)

  render() {
    const { currentUser } = this.props

    const {
      show,
      refCount,
      ticketQty,
      refPrice,
      loading,
      errors,
      bookingDone,
    } = this.state

    return (
      <>
        <HeaderWithAuth currentUser={currentUser} />

        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 600 }}>
            <Header as="h2">Book a Show</Header>

            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  fluid
                  name="ticketQty"
                  label="Ticket Quantity"
                  value={ticketQty}
                  placeholder="Enter the required number of tickets"
                  onChange={this.handleChange}
                  type="number"
                />

                <Message info>
                  There are a total of {show.ticketCount} tickets available
                </Message>

                <Form.Input
                  fluid
                  name="refCount"
                  label="Refreshment Quantity"
                  value={refCount}
                  placeholder="Enter the required number of refreshments"
                  onChange={this.handleChange}
                  type="number"
                />

                <Message info>Each refreshment costs {refPrice} rupees</Message>

                <Button
                  color="black"
                  size="large"
                  className={loading ? 'loading' : ''}
                >
                  Buy Tickets
                </Button>
              </Segment>
            </Form>
            {errors.length > 0 && (
              <Message error>{this.displayErrors(errors)}</Message>
            )}
            {bookingDone && (
              <Message info>
                Ticket Price: {this.state.ticketTotalPrice}
                <br />
                Refreshment Cost: {this.state.refTotalPrice}
                <br />
                Total Bill: {this.state.totalPrice}
              </Message>
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

export default connect(mapStateToProps)(BookShow)
