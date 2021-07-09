import React from "react"
import * as Survey from "survey-react"
import moment from "moment"
import "./App.css"
import "survey-react/survey.css"

export default class SurveyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isCompleted: false,
      error: null,
      isLoaded: false,
      json: {},
      start_time: moment().format(),

      survey_id: "",

      toReturn: [],
    }
    this.onCompleteComponent = this.onCompleteComponent.bind(this)
  }
  onCompleteComponent(data) {
    let finalToReturn = this.state.toReturn

    finalToReturn.map((item, index) => {
      finalToReturn[index]["q_ans"] = data[`question${index + 1}`]
    })
    console.log(finalToReturn)
    let response = {
      ans: finalToReturn,
      local_id: 8,
      survey_id: this.state.survey_id,
      start_time: this.state.start_time,
      end_time: moment().format(),
      location: {
        lon: 0.0,
        accuracy: 0.0,
        lat: 0.0,
      },
    }
    this.sendForm(response)
    this.setState({ isCompleted: true })
  }

  sendForm = async (tosend) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${this.props.accessToken}`,
        HTTP_VERSIONCODE: 200,
        VERSIONCODE: 200,
      },
      body: JSON.stringify(tosend),
    }
    fetch(
      "http://fullstack-role.busara.io/api/v1/recruitment/answers/submit/",
      options
    )
      .then((data) => {
        if (!data.ok) {
          throw Error(data.status)
        }
        return data.json()
      })
      .then(async (update) => {
        console.log(update)
      })
      .catch((e) => {
        console.log(e)
      })
  }
  componentDidMount() {
    fetch(
      "http://fullstack-role.busara.io/api/v1/recruitment/forms/?node_type=Both",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          let json = {
            showProgressBar: "bottom",
            goNextPageAutomatic: true,
            showNavigationButtons: true,
            pages: [],
          }
          let answers = []
          let newJSON = result.forms.map((form) => {
            json.title = form.name
            this.setState({ survey_id: form.id })
            form.pages.map((page) => {
              let newPage = {
                title: page.name,
                questions: [],
              }
              page.sections.map((section) => {
                Object.entries(section.questions).forEach(([key, value]) => {
                  let type
                  let answer = {}
                  let options = { choices: [] }
                  if (value.type == "text") {
                    type = "text"
                  }

                  if (value.type == "select") {
                    const doc = new DOMParser().parseFromString(
                      value.text,
                      "text/html"
                    )
                    // console.log("PARSING TITLE", value.text)
                    options.title = doc.firstChild.textContent
                    options.type = "radiogroup"
                    // options.text = value.text("font")

                    if (value.q_options) {
                      value.q_options.map((item) =>
                        options.choices.push(item.name)
                      )
                    }
                  }
                  if (value.type == "tel") {
                    options.inputMask = "phone"
                    options.inputFormat = "+#(###)-###-####"
                  }
                  newPage.questions.push({
                    title: value.text,
                    column_match: value.column_match,
                    name: value.name,
                    isRequired: value.is_mandatory,
                    type: "text",
                    ...options,
                  })
                  answer["q_id"] = value.id
                  answer["column_match"] = value.column_match
                  answers.push(answer)
                })
              })
              return json.pages.push(newPage)
            })

            return json
          })
          this.setState({
            isLoaded: true,
            json: newJSON[0],
            toReturn: answers,
          })
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          })
        }
      )
  }

  render() {
    const { error, isLoaded, json } = this.state

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      console.log(json)
      console.log(this.state.json)
      var surveyRender = !this.state.isCompleted ? (
        <Survey.Survey
          json={json}
          showCompletedPage={false}
          onComplete={(data) => this.onCompleteComponent(data.valuesHash)}
        />
      ) : null
      var onCompleteComponent = this.state.isCompleted ? (
        <div>The component after onComplete event</div>
      ) : null
      return (
        <div>
          {surveyRender}
          {onCompleteComponent}
        </div>
      )
    }
  }
}
