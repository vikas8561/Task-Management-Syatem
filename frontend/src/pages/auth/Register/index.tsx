import { ErrorMessage, Field, Form, Formik } from 'formik' 
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { useAuth } from '../../../context/Auth.context'

const Register = () => {
  const { registerUser } = useAuth()
  const navigate = useNavigate()

  type RegisterType = {
    name: string
    email: string
    password: string
  }

  const validationSchema = yup.object().shape({
    name: yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: yup.string()
      .email("Email must be valid")
      .required("Email is required")
      .lowercase(),
    password: yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
  })

  const initialValues: RegisterType = {
    name: '',
    email: '',
    password: ''
  }

  const onSubmitHandler = async (values: RegisterType, { setSubmitting, resetForm }: any) => {
    try {
      const data = await registerUser(values.name, values.email, values.password)
      
      toast.success(data?.msg || "Registration successful!")
      
      // Reset form and navigate to login after successful registration
      resetForm()
      navigate('/auth/login')
      
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.")
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
              <h1 className="mb-0">Register</h1>
              <p className="text-muted">Create your account</p>
            </div>
            
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Full Name <span className="text-danger">*</span>
              </label>
              <Field 
                name="name" 
                id="name" 
                type="text" 
                className="form-control" 
                placeholder="John Doe" 
              />
              <ErrorMessage name='name' component={'p'} className='text-sm text-danger mt-1' />
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
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </div>
            
            <div className="mb-3 text-center">
              <p className='text-secondary mb-0'>
                Already have an account? <Link to={'/auth/login'} className="text-decoration-none">Login</Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Register