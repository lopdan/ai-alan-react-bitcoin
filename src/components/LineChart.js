import React, {useState, useEffect} from "react";
import "./LineChart.css";

const LineChart = props => {
  const [profileState, setProfileState] = useState(props)

  const [pointData, setPointData] = useState({
    hoverLoc: null,
    activePoint: null
  })
  useEffect(() =>{
    setProfileState(profileState);
  },[props]) 

  const getX = () => {
    const data = profileState.data;
    return {
      min: data[0].x,
      max: data[data.length - 1].x
    }
  }
  const getY = () => {
    const data = profileState.data;
    return {
      min: data.reduce((min, p) => p.y < min ? p.y : min, data[0].y),
      max: data.reduce((max, p) => p.y > max ? p.y : max, data[0].y)
    }
  }
  // GET SVG COORDINATES
  const getSvgX = x => {
    const {svgWidth, yLabelSize} = profileState;
    return yLabelSize + (x / getX().max * (svgWidth - yLabelSize));
  }
  const getSvgY = y => {
    const {svgHeight, xLabelSize} = profileState;
    const gY = getY();
    return ((svgHeight - xLabelSize) * gY.max - (svgHeight - xLabelSize) * y) / (gY.max - gY.min);
  }
  // BUILD SVG PATH
  const makePath = () => {
    const {data, color} = profileState;
    let pathD = "M " + getSvgX(data[0].x) + " " + getSvgY(data[0].y) + " ";

    pathD += data.map((point, i) => {
      return "L " + getSvgX(point.x) + " " + getSvgY(point.y) + " ";
    }).join("");

    return (
      <path className="linechart_path" d={pathD} style={{stroke: color}} />
    );
  }
  // BUILD SHADED AREA
  const makeArea = () => {
    const {data} = profileState;
    let pathD = "M " + getSvgX(data[0].x) + " " + getSvgY(data[0].y) + " ";

    pathD += data.map((point, i) => {
      return "L " + getSvgX(point.x) + " " + getSvgY(point.y) + " ";
    }).join("");

    const x = getX();
    const y = getY();
    pathD += "L " + getSvgX(x.max) + " " + getSvgY(y.min) + " "
    + "L " + getSvgX(x.min) + " " + getSvgY(y.min) + " ";

    return <path className="linechart_area" d={pathD} />
  }
  // BUILD GRID AXIS
  const makeAxis = () => {
    const yLabelSize = profileState.yLabelSize;
    const x = getX();
    const y = getY();

    return (
      <g className="linechart_axis">
        <line
          x1={getSvgX(x.min) - yLabelSize} y1={getSvgY(y.min)}
          x2={getSvgX(x.max)} y2={getSvgY(y.min)}
          strokeDasharray="5" />
        <line
          x1={getSvgX(x.min) - yLabelSize} y1={getSvgY(y.max)}
          x2={getSvgX(x.max)} y2={getSvgY(y.max)}
          strokeDasharray="5" />
      </g>
    );
  }
  const makeLabels = () => {
    const {svgHeight, svgWidth, xLabelSize, yLabelSize} = profileState;
    const padding = 10;
    return(
      <g className="linechart_label">
        {/** Y AXIS LABELS */}
        <text transform={`translate(${yLabelSize/2}, 20)`} textAnchor="middle">
          {getY().max.toLocaleString('us-EN',{ style: 'currency', currency: 'USD' })}
        </text>
        <text transform={`translate(${yLabelSize/2}, ${svgHeight - xLabelSize - padding})`} textAnchor="middle">
          {getY().min.toLocaleString('us-EN',{ style: 'currency', currency: 'USD' })}
        </text>
        {/** X AXIS LABELS */}
        <text transform={`translate(${yLabelSize}, ${svgHeight})`} textAnchor="start">
          {profileState.data[0].d }
        </text>
        <text transform={`translate(${svgWidth}, ${svgHeight})`} textAnchor="end">
          {profileState.data[profileState.data.length - 1].d }
        </text>
      </g>
    )
  }
  // Closes point to mouse
  const getCoords = e => {
    const {svgWidth, data, yLabelSize} = profileState;
    const svgLocation = document.getElementsByClassName("linechart")[0].getBoundingClientRect();
    const adjustment = (svgLocation.width - svgWidth) / 2; //takes padding into consideration
    const relativeLoc = e.clientX - svgLocation.left - adjustment;

    let svgData = [];
    data.map((point, i) => {
      svgData.push({
        svgX: getSvgX(point.x),
        svgY: getSvgY(point.y),
        d: point.d,
        p: point.p
      });
    });

    let closestPoint = {};
    for(let i = 0, c = 500; i < svgData.length; i++){
      if ( Math.abs(svgData[i].svgX - pointData.hoverLoc) <= c ){
        c = Math.abs(svgData[i].svgX - pointData.hoverLoc);
        closestPoint = svgData[i];
      }
    }

    if(relativeLoc - yLabelSize < 0){
      stopHover();
    } else {
      setPointData({
        hoverLoc: relativeLoc,
        activePoint: closestPoint
      })
      profileState.onChartHover(relativeLoc, closestPoint);
    }
  }
  const stopHover = () => {
    setPointData({hoverLoc: null, activePoint: null});
    profileState.onChartHover(null, null);
  }
  // Point in chart
  const makeActivePoint = () => {
    const {color, pointRadius} = profileState;
    return (
      <circle
        className='linechart_point'
        style={{stroke: color}}
        r={pointRadius}
        cx={pointData.activePoint.svgX}
        cy={pointData.activePoint.svgY}
      />
    );
  }
  // Hover line
  const createLine = () =>{
    const {svgHeight, xLabelSize} = profileState;
    return (
      <line className='hoverLine'
        x1={pointData.hoverLoc} y1={-8}
        x2={pointData.hoverLoc} y2={svgHeight - xLabelSize} />
    )
  }
  const {svgHeight, svgWidth} = profileState;
  return (
    <svg  width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={'linechart'}
          onMouseLeave={ () => stopHover() }
          onMouseMove={ (e) => getCoords(e) } >
      <g>
        {makeAxis()}
        {makePath()}
        {makeArea()}
        {makeLabels()}
        {pointData.hoverLoc ? createLine() : null}
        {pointData.hoverLoc ? makeActivePoint() : null}
      </g>
    </svg>
  );
}
// DEFAULT PROPS
LineChart.defaultProps = {
  data: [],
  color: '#32c500',
  pointRadius: 5,
  svgHeight: 300,
  svgWidth: 900,
  xLabelSize: 20,
  yLabelSize: 80
}

export default LineChart;
