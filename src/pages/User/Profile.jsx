import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import {
  clearAuthMessages,
  fetchUserProfile,
  updateUserProfile,
} from "../../ReduxSetUp/Feature/Auth/AuthSlice";

const emptyProfile = {
  firstName: "",
  lastName: "",
  address: "",
  phoneNumber: "",
  accountDetails: "",
  profilePicture: "",
  preferences: "",
};

const getInitials = (value = "") => {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase())
    .join("");
};

const trimProfileFields = (profileFields) => {
  return Object.entries(profileFields).reduce(
    (accumulator, [key, value]) => {
      const trimmedValue = value.trim();

      if (trimmedValue) {
        accumulator[key] = trimmedValue;
      }

      return accumulator;
    },
    {}
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const {
    userInfo,
    profileLoading,
    updateLoading,
    profileError,
  } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileFields, setProfileFields] = useState(emptyProfile);

  useEffect(() => {
    dispatch(fetchUserProfile());

    return () => {
      dispatch(clearAuthMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!userInfo) {
      return;
    }

    setUsername(userInfo.username || "");
    setEmail(userInfo.email || "");
    setProfileFields({
      ...emptyProfile,
      ...(userInfo.Profile || {}),
    });
  }, [userInfo]);

  const initials = useMemo(
    () => getInitials(username || email || "User"),
    [email, username]
  );

  const handleProfileFieldChange = (field, value) => {
    setProfileFields((currentFields) => ({
      ...currentFields,
      [field]: value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const payload = {
      username: username.trim(),
      email: email.trim(),
    };

    const trimmedProfile = trimProfileFields(profileFields);

    if (Object.keys(trimmedProfile).length > 0) {
      payload.Profile = trimmedProfile;
    }

    if (password.trim()) {
      payload.password = password;
    }

    try {
      await dispatch(updateUserProfile(payload)).unwrap();
      setPassword("");
      setConfirmPassword("");
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.message || "Profile update failed");
    }
  };

  if (profileLoading && !userInfo) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-32">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-xl font-extrabold text-white">
                {initials || "U"}
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {username || "Your profile"}
                </p>
                <p className="text-sm text-slate-500">
                  {email || "Add your email address"}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-[1.75rem] bg-slate-50 p-5 text-sm text-slate-600">
              <p>Your profile is now connected to the backend.</p>
              <p>
                Any changes you save here are sent to
                <span className="font-semibold text-slate-900">
                  {" "}
                  `/api/users/profile`
                </span>
                .
              </p>
            </div>
          </div>

          {updateLoading && (
            <div className="flex justify-center rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <Loader />
            </div>
          )}
        </aside>

        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Update profile
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Keep your username, email, and optional profile fields in sync with
            the user document stored in MongoDB.
          </p>

          {profileError && (
            <div className="mt-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {profileError}
            </div>
          )}

          <form onSubmit={submitHandler} className="mt-8 space-y-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">Username</label>
                <input
                  type="text"
                  className="field-input"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>

              <div>
                <label className="field-label">Email</label>
                <input
                  type="email"
                  className="field-input"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div>
                <label className="field-label">New password</label>
                <input
                  type="password"
                  className="field-input"
                  placeholder="Leave blank to keep the current password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div>
                <label className="field-label">Confirm password</label>
                <input
                  type="password"
                  className="field-input"
                  placeholder="Repeat the new password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-lg font-bold text-slate-900">
                  Profile details
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  These fields map directly to the nested
                  <span className="font-semibold text-slate-900">
                    {" "}
                    `Profile`
                  </span>
                  {" "}object in your backend user model.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="field-label">First name</label>
                  <input
                    type="text"
                    className="field-input"
                    value={profileFields.firstName}
                    onChange={(event) =>
                      handleProfileFieldChange(
                        "firstName",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="field-label">Last name</label>
                  <input
                    type="text"
                    className="field-input"
                    value={profileFields.lastName}
                    onChange={(event) =>
                      handleProfileFieldChange(
                        "lastName",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="field-label">Phone number</label>
                  <input
                    type="text"
                    className="field-input"
                    value={profileFields.phoneNumber}
                    onChange={(event) =>
                      handleProfileFieldChange(
                        "phoneNumber",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="field-label">Address</label>
                  <input
                    type="text"
                    className="field-input"
                    value={profileFields.address}
                    onChange={(event) =>
                      handleProfileFieldChange(
                        "address",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="field-label">Account details</label>
                  <input
                    type="text"
                    className="field-input"
                    value={profileFields.accountDetails}
                    onChange={(event) =>
                      handleProfileFieldChange(
                        "accountDetails",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="field-label">Profile picture URL</label>
                  <input
                    type="text"
                    className="field-input"
                    value={profileFields.profilePicture}
                    onChange={(event) =>
                      handleProfileFieldChange(
                        "profilePicture",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Preferences</label>
                <textarea
                  rows="4"
                  className="field-input min-h-32 resize-y"
                  value={profileFields.preferences}
                  onChange={(event) =>
                    handleProfileFieldChange(
                      "preferences",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updateLoading}
              className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-70"
            >
              {updateLoading ? "Saving changes..." : "Save profile"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
