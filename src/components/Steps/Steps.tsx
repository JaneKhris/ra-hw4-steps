import { useState } from "react";
import { dateToStr } from "../../utils/utils";
import { IForm, TStepsArray } from "../../models";

export const Steps = () => {
  
  const [form, setForm] = useState<IForm>({
    date: "",
    km: "",
  });

  const [stepsArray, setStepsArray] = useState<TStepsArray>([]);

  const { date, km } = form;


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("new data:", form);
    let newDate: boolean = true;
    const stepsArrayCurrent = stepsArray;
    const result = form.date.match(/([1-3]?[0-9]).([01]?[0-9]).(20[0-9]{2})/);
    if (result && Number(form.km)) {
      const dateForm = new Date(
        Number(result[3]),
        Number(result[2]) - 1,
        Number(result[1])
      );
      console.log(dateForm);
      stepsArrayCurrent.forEach((item) => {
        if (item.date.getTime() - dateForm.getTime() === 0) {
          item.km = +(item.km + Number(form.km)).toFixed(2);
          newDate = false;
        }
      });
      if (newDate) {
        setStepsArray(
          stepsArray.concat([{ date: dateForm, km: Number(form.km) }])
        );
      } else {
        setStepsArray(stepsArrayCurrent);
      }
      setForm({
        date: "",
        km: "",
      });
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(e.target);

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };


  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const dateRemove = Number((e.target as HTMLButtonElement).name);
    setStepsArray(
      stepsArray.filter((step) => step.date.getTime() != dateRemove)
    );
  };


  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const dateEdit = Number((e.target as HTMLButtonElement).name);
    const stepEdit = stepsArray.find(
      (step) => step.date.getTime() === dateEdit
    );
    if (stepEdit) {
      setForm({
        date: dateToStr(stepEdit.date),
        km: String(stepEdit.km),
      });
    }
    setStepsArray(stepsArray.filter((step) => step.date.getTime() != dateEdit));
  };


  return (
    <>
      <form className="form" autoComplete="off" onSubmit={handleSubmit}>
        <div className="input-box">
          <label htmlFor="date">Дата (дд.мм.гггг)</label>
          <input
            id="date"
            name="date"
            type="text"
            value={date}
            onChange={handleChange}
          />
        </div>
        <div className="input-box">
          <label htmlFor="km">Пройдено (км)</label>
          <input
            id="km"
            name="km"
            type="text"
            value={km}
            onChange={handleChange}
          />
        </div>
        <button className="submit" type="submit">
          OK
        </button>
      </form>
      <div className="header-container">
        <div className="header header-date">Дата</div>
        <div className="header header-km">Пройдено км</div>
        <div className="header header-act">Действия</div>
      </div>

      {stepsArray.length > 0 && (
        <div className="data-container">
          <table>
            {stepsArray
              .sort((a, b) => (a.date > b.date ? 1 : -1))
              .map((item) => (
                <tr key={item.date.getTime()}>
                  <td>{dateToStr(item.date)}</td>
                  <td>{item.km}</td>
                  <button
                    className="edit"
                    name={String(item.date.getTime())}
                    onClick={handleEdit}
                  >
                    🖉
                  </button>
                  <button
                    className="delete"
                    name={String(item.date.getTime())}
                    onClick={handleDelete}
                  >
                    ✘
                  </button>
                </tr>
              ))}
          </table>
        </div>
      )}
    </>
  );
};
