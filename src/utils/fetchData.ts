import { Dispatch, SetStateAction, useState } from "react";

function fetchData<T extends (value: React.SetStateAction<T>) => void>(endpoint: string, setData: Dispatch<SetStateAction<undefined>>) {
    fetch(EndPoint.root + EndPoint.adoption + "/" + adoption_id)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData) => {
        console.log("Actual data");
        console.log(actualData);
        let fetchData: AdoptionRequest = {
          id: actualData.id,
          start_date: new Date(actualData.start_date + "Z"),
          end_date: new Date(actualData.end_date + "Z"),
          note: actualData.note ? actualData.note : "",
          adoptee_id: actualData.adoptee.id,
          employee_id: actualData.employee.id,
          adoption_status_id: actualData.adoption_status.id,
          animal_id: actualData.animal.id,
        };
        setData(fetchData);
        setDataOriginal(fetchData);
        console.log(fetchData);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err.message);
      });
}
const [first, setfirst] = useState();

function anotherFunc(func: (x: number) => void): (x:number) => void {
    return func
}

function testFunc(value: number) : void {

}
