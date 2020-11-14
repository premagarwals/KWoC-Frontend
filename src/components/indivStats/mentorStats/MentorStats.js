import React, { useState, useEffect } from 'react'
import './MentorStats.scss'

import axios from 'axios'
import { STATS_API } from '../../../constants/constants'

function Commits(props) {
    return(
        <ul>
            {props.commits.map(item => {
                return(
                <li><a href={item['html_url']}>{item['message']}</a>{`(+${item['lines_added']},-${item['lines_removed']})`}</li>
                )
            })}
        </ul>
    )
}

function Contris(props) {
    console.log("props.contris ", props.contris)
    return(
        <React.Fragment >
            {Object.entries(props.contris).map(item => {
                return(
                    <React.Fragment>
                        <u><a href={`https://github.com/${item[0]}`}><h4>{item[0]}</h4></a></u> 
                         <Commits commits={item[1]} />
                    </React.Fragment>
                )
            })}
        </React.Fragment>
      
    )
}

export default function MentorStats() {
    const [username, setUsername] = useState('')
    const [mentorName, setMentorName] = useState('')
    const [stats, setStats] = useState({})
    
    useEffect(() => {
        const username_from_window = window.location.pathname.split('/')[3]
        setUsername(username_from_window)
      
        axios
        .get(`${STATS_API}/stats/mentor/${username_from_window}`)
        .then(res => {
         console.log("mentor_name ",res.data[username_from_window]['mentor_name'])
         setMentorName(res.data[username_from_window]['mentor_name'])
         
        const projectWiseStats = res.data[username_from_window]
        delete projectWiseStats['mentor_name']
        console.log("stats are ",projectWiseStats)

        setStats(projectWiseStats)
        })
        .catch(err => {
          console.log("Err is ", err)
          alert("Server Error,try again")
        })
    },[])


    console.log("objentise stats ",Object.entries(stats))
    return(
        <div className="mentor-stats">
            <img  className="mentor-avatar" src={`https://github.com/${username}.png`} />
            <h1>{mentorName}</h1>
            
            {Object.entries(stats).map(item => {
                console.log("item is ",item)
                var contris1 = {...item[1]}
                delete contris1['title']
                console.log("contris in 1 ", contris1)
                return(
                    <React.Fragment>
                        <h3><a href={`https://github.com/${username}/${item[0]}`}>{item[1]['title']}</a></h3>
                        <Contris contris={contris1} />
                    </React.Fragment>
                    )
            })}
            
        </div>
    )
}