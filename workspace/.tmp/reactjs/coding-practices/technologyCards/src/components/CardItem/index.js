// Write your code here.
import './index.css'

const CardItem = props => {
  const {cardDetails} = props
  const {title, description, imgUrl, className} = cardDetails
  return (
    <li className={`card-bg ${className}`}>
      <div className="content-container">
        <h1 className="card-heading">{title}</h1>
        <p className="card-description">{description}</p>
        <img src={imgUrl} alt={title} />
      </div>
    </li>
  )
}

export default CardItem
