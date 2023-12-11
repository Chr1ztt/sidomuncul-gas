import { useEffect, useState } from "react"

export default function NumberTypewriter({target}) {
  const rupiahFormat = (value) => new Intl.NumberFormat("id-ID").format(value);
  const [number, setNumber] = useState(0);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setNumber(prevNumber => {
        // console.log(prevNumber);
        if(prevNumber<target){
          const distance = target-prevNumber;
          const speed = Math.max(1, Math.ceil(distance/3));
          return prevNumber+speed;
        }else{
          clearInterval(intervalId);
          return prevNumber;
        }
      })
    }, 40);

    return () => clearInterval(intervalId);
  }, [])

  return (
    <div className="inline-flex">{rupiahFormat(number)}</div>
  )
}
