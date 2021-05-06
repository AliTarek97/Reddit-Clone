import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/ceateUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import NextLink from "next/link";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Wrapper variant={"small"}>
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token,
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              label="New Password"
              placeholder="new password"
              type="password"
            ></InputField>

            {tokenError ? (
              <Flex>
                <Box mr={2} color="red">{tokenError}</Box>
                <NextLink href='/forgot-password'>
                  <Link>click here to get a new one</Link>
                </NextLink>
              </Flex>
            ) : null}

            <Button
              type="submit"
              isLoading={isSubmitting}
              mt={4}
              textColor="white"
              backgroundColor="teal"
            >
              {" "}
              change password{" "}
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

// special function in next.js allows us
// to get any query parameter passed to this component
ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

// TODO try to remove any and solve the error
export default withUrqlClient(createUrqlClient)(ChangePassword as any);
