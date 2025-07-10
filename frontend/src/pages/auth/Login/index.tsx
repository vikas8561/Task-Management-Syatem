import { ErrorMessage, Field, Form, Formik } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { useAuth } from '../../../context/Auth.context'

const Login = () => {
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  type LoginType = {
    email: string
    password: string
  }

  const validationSchema = yup.object().shape({
    email: yup.string()
      .email("Email must be valid")
      .required("Email is required")
      .lowercase(),
    password: yup.string()
      .required("Password is required")
  })

  const initialValues: LoginType = {
    email: '',
    password: ''
  }

  const onSubmitHandler = async (values: LoginType, { setSubmitting }: any) => {
    try {
      await loginUser(values.email, values.password)
      toast.success("Login successful!")
      navigate("/")
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please check your credentials.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container">
      <Formik 
        validationSchema={validationSchema} 
        initialValues={initialValues} 
        onSubmit={onSubmitHandler}
      >
        {({ isSubmitting }) => (
          <Form className='col-sm-12 col-md-6 col-lg-4 mx-auto border px-4 py-4 my-5 rounded shadow'>
            <div className="mb-3 py-4 text-center">
              <h1 className="mb-0">Login</h1>
              <p className="text-muted">Welcome back!</p>
            </div>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address <span className="text-danger">*</span>
              </label>
              <Field 
                name="email" 
                id="email" 
                type="email" 
                className="form-control" 
                placeholder="john@gmail.com" 
              />
              <ErrorMessage name='email' component={'p'} className='text-sm text-danger mt-1' />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password <span className="text-danger">*</span>
              </label>
              <Field 
                name="password" 
                id="password" 
                type="password" 
                className="form-control" 
                placeholder="Enter your password" 
              />
              <ErrorMessage name='password' component={'p'} className='text-sm text-danger mt-1' />
            </div>
            
            <div className="mb-3">
              <button 
                type='submit' 
                className="btn btn-dark w-100" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>
            
            <div className="mb-3 text-center">
              <p className='text-secondary mb-0'>
                Don't have an account? <Link to={'/auth/register'} className="text-decoration-none">Register</Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Login