import React, { Component } from 'react'

export default class PredictList extends Component {
  render() {
    const { prompts } = this.props;
    return (
        <ul className="list-group">
        {prompts.map((prompt,index) => (
          <li key={index} className="list-group-item">
            Sentiment: {prompt.emotion}, Text: {prompt.prompt}
          </li>
        ))}
      </ul>
    )
  }
}
