import React from "react";
import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";

interface registerProps {}

const REGISTER_MUT = `
      mutation Register($username: String!, $password: String!){
        register(options: { username: $username, password: $password }) {
          errors {
            field
            message
          }

          user {
            id
            username
          }
        }
      }
`

export const Register: React.FC<registerProps> = ({}) => {
  const [,register] = useMutation(REGISTER_MUT);
  return (
    <Wrapper variant={"small"}>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          return register(values)
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="username"
            ></InputField>

            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="password"
                type="password"
              ></InputField>
            </Box>

            <Button
              type="submit"
              isLoading={isSubmitting}
              mt={4}
              textColor="white"
              backgroundColor="teal"
            >
              {" "}
              register{" "}
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
