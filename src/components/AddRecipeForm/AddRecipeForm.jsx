import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './AddRecipeForm.module.css';

import Select from 'react-select';

const validationSchema = Yup.object({
  title: Yup.string().max(64).required('Required'),
  description: Yup.string().max(200).required('Required'),
  time: Yup.number().min(1).max(360).required('Required'),
  calories: Yup.number().min(1).max(1000).required('Required'),
  category: Yup.string().required('Required'),
  instructions: Yup.string().required('Required'),
  image: Yup.mixed().required('Required'),
});

{
  /* заглушка */
}
const categoryOptions = [
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Lunch', label: 'Lunch' },
  { value: 'Dinner', label: 'Dinner' },
];

const ingredientOptions = [
  { value: 'Tomato', label: 'Tomato' },
  { value: 'Cheese', label: 'Cheese' },
  { value: 'Chicken', label: 'Chicken' },
];

export default function AddRecipeForm() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [preview, setPreview] = useState(null);

  const handleAddIngredient = (values, setFieldValue) => {
    const { ingredient, amount } = values;
    if (!ingredient || !amount) return;
    setSelectedIngredients(p => [...p, { name: ingredient, amount }]);
    setFieldValue('ingredient', '');
    setFieldValue('amount', '');
  };

  const handleRemoveIngredient = i => {
    setSelectedIngredients(p => p.filter((_, idx) => idx !== i));
  };

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue('image', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Form submitted:', values);
    console.log('Ingredients:', selectedIngredients);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        title: '',
        description: '',
        time: '',
        calories: '',
        category: '',
        instructions: '',
        ingredient: '',
        amount: '',
        image: null,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className={css.form}>
          {/* Upload Photo*/}
          <div className={css.rightGoup}>
            <section className={css.uploadSection}>
              <h2 className={css.sectionTitle}>Upload Photo</h2>
              <div className={css.uploadItem}>
                <label htmlFor="thumb" className={css.imageUpload}>
                  <input
                    id="thumb"
                    name="image"
                    type="file"
                    accept="image/*"
                    className={css.hiddenInput}
                    onChange={e => handleImageChange(e, setFieldValue)}
                  />
                  {preview ? (
                    <img src={preview} alt="Preview" width="150" />
                  ) : (
                    <svg width="82" height="82">
                      <use href="/icons.svg#icon-photo"></use>
                    </svg>
                  )}
                </label>
              </div>
              <ErrorMessage
                name="image"
                component="div"
                className={css.error}
              />
            </section>
          </div>
          {/* General Information */}
          <div className={css.leftGroup}>
            <section className={css.generalSection}>
              <h2 className={css.sectionTitle}>General Information</h2>
              <div className={css.generalItems}>
                <div className={css.descriptionItem}>
                  <label className={css.smallTitle}>Recipe Title</label>
                  <Field
                    name="title"
                    type="text"
                    placeholder="Enter the name of your recipe"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className={css.error}
                  />
                </div>

                <div className={css.descriptionItem}>
                  <label className={css.smallTitle}>Recipe Description</label>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Enter a brief description of your recipe"
                    className={css.textGeneral}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className={css.error}
                  />
                </div>

                <div className={css.descriptionItem}>
                  <label className={css.smallTitle}>
                    Cooking Time (minutes)
                  </label>
                  <Field name="time" type="number" placeholder="10" />
                  <ErrorMessage
                    name="time"
                    component="div"
                    className={css.error}
                  />
                </div>

                <div className={css.wrapp}>
                  <div>
                    <label className={css.smallTitle}>Calories</label>
                    <Field
                      name="calories"
                      type="number"
                      placeholder="150"
                      className={css.inputC}
                    />
                    <ErrorMessage
                      name="calories"
                      component="div"
                      className={css.error}
                    />
                  </div>

                  <div>
                    <label className={css.smallTitle}>Category</label>
                    <Select
                      options={categoryOptions}
                      value={
                        categoryOptions.find(
                          opt => opt.value === values.category
                        ) || null
                      }
                      onChange={option =>
                        setFieldValue('category', option.value)
                      }
                      placeholder="Soup"
                      styles={{
                        control: base => ({
                          ...base,
                          border: '1px solid var(--light-gray)',
                          borderRadius: '8px',
                          padding: '0 12px',

                          height: '48px',

                          boxShadow: 'none',
                          '&:hover': {
                            borderColor: 'var(--light-gray)',
                          },
                        }),
                        valueContainer: base => ({
                          ...base,
                          padding: 0,
                        }),
                        indicatorsContainer: base => ({
                          ...base,
                          height: '48px',
                        }),
                        dropdownIndicator: base => ({
                          ...base,
                          padding: '0 8px',
                        }),
                        indicatorSeparator: () => ({ display: 'none' }),
                        menu: base => ({
                          ...base,
                          borderRadius: '8px',
                          marginTop: '4px',
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Ingredients */}
            <section className={css.ingredientsSection}>
              <h2 className={css.sectionTitle}>Ingredients</h2>
              <div className={css.sectionsItems}>
                <div className={css.ingredientName}>
                  <label className={css.smallTitle}>Name</label>
                  <Select
                    options={ingredientOptions}
                    value={
                      ingredientOptions.find(
                        opt => opt.value === values.ingredient
                      ) || null
                    }
                    onChange={option =>
                      setFieldValue('ingredient', option.value)
                    }
                    placeholder="Select ingredient"
                    styles={{
                      control: base => ({
                        ...base,
                        border: '1px solid var(--light-gray)',
                        borderRadius: '8px',
                        padding: '0 12px',

                        height: '48px',
                        minHeight: '48px',
                        maxHeight: '48px',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: 'var(--light-gray)',
                        },
                      }),
                      valueContainer: base => ({
                        ...base,
                        padding: 0,
                      }),
                      indicatorsContainer: base => ({
                        ...base,
                        height: '48px',
                      }),
                      dropdownIndicator: base => ({
                        ...base,
                        padding: '0 8px',
                      }),
                      indicatorSeparator: () => ({ display: 'none' }),
                      menu: base => ({
                        ...base,
                        borderRadius: '8px',
                        marginTop: '4px',
                      }),
                    }}
                  />
                </div>
                <div className={css.ingredientAmount}>
                  <label className={css.smallTitle}>Amount</label>
                  <Field name="amount" type="text" placeholder="100g" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAddIngredient(values, setFieldValue)}
              >
                Add new Ingredient
              </button>

              <ul className={css.selectedIngredients}>
                <li
                  className={`${css.selectedIngredientsHeader} ${
                    selectedIngredients.length === 0
                      ? css.hideHeaderOnMobile
                      : ''
                  }`}
                >
                  <span className={css.spanName}>Name:</span>
                  <span className={css.spanAmount}>Amount:</span>
                  <span></span>
                </li>

                {selectedIngredients.map((item, i) => (
                  <li key={i}>
                    <span className={css.spanItemsName}>{item.name}</span>
                    <span className={css.spanItemsAmount}>{item.amount}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(i)}
                    >
                      <svg width="24" height="24">
                        <use href="/icons.svg#icon-delete"></use>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
            {/* Instructions */}
            <section className={css.instructionsSection}>
              <label className={css.sectionTitle}>Instructions</label>
              <Field
                as="textarea"
                name="instructions"
                placeholder="Enter a text"
                className={css.textInstructions}
              />
              <ErrorMessage
                name="instructions"
                component="div"
                className={css.error}
              />

              <button type="submit" disabled={isSubmitting}>
                Publish Recipe
              </button>
            </section>
          </div>
        </Form>
      )}
    </Formik>
  );
}
