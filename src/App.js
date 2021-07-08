import React, { useState } from "react"
import { Button, Form, Grid, Header, Image, Segment } from "semantic-ui-react"
import axios from "axios"
import request from "postman-request"

function App() {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const submit = async () => {
    try {
      const data = {
        grant_type: `password`,
        client_id: `zVs3J7FZupB3TLPskQOy1xHLwYTRkzUSf2rdTDCu`,
        client_secret: `Zv19oWmm416sTyjWT5Sx2r1gRwjWrXU3P5dWledQpYjxEvavS58SPtz03M8wvsgajaVLhcimmJIUUYUDad06V6HQosmPoj3TPRNjg7bgniQlooIwyFWfz8KfkM5Tdh7R`,
        username: `ericinoti@gmail.com`,
        password: `TUOKPI878*`,
      }
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data),
      }

      fetch("http://fullstack-role.busara.io/api/v1/oauth/token/", options)
        .then((data) => {
          if (!data.ok) {
            throw Error(data.status)
          }
          return data.json()
        })
        .then((update) => {
          console.log(update)
        })
        .catch((e) => {
          console.log(e)
        })
      // console.log(result)
    } catch (error) {}
  }
  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          <Image src="/logo.png" /> Log-in to your account
        </Header>
        <Form size="large" onSubmit={submit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              onChange={(e) => setUsername({ username: e.target.value })}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={(e) => setUsername({ password: e.target.value })}
            />

            <Button color="teal" fluid size="large">
              Login
            </Button>
          </Segment>
        </Form>
        {/* <Message>
          New to us? <a href="#">Sign Up</a>
        </Message> */}
      </Grid.Column>
    </Grid>
  )
}

export default App
