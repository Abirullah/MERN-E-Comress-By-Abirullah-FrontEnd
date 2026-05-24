import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../redux/api/usersApiSlice";
// import { getInitials } from "../../utils/formatters";
// import { normalizeUserSession } from "../../utils/session";

const emptyProfile = {
  firstName: "",
  lastName: "",
  address: "",
  phoneNumber: "",
  accountDetails: "",
  profilePicture: "",
  preferences: "",
};

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileFields, setProfileFields] = useState(emptyProfile);

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useGetProfileQuery();
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useUpdateProfileMutation();

  useEffect(() => {
    const source = profileData || userInfo;

    if (!source) {
      return;
    }

    setUsername(source.username || "");
    setEmail(source.email || "");
    setProfileFields({
      ...emptyProfile,
      ...(source.Profile || {}),
    });
  }, [profileData, userInfo]);

  const handleProfileFieldChange = (field, value) => {
    setProfileFields((currentFields) => ({
      ...currentFields,
      [field]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const payload = {
      username,
      email,
      Profile: profileFields,
    };

    if (password) {
      payload.password = password;
    }

    try {
      const res = await updateProfile(payload).unwrap();
      dispatch(setCredentials(normalizeUserSession(res)));
      setPassword("");
      setConfirmPassword("");
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Update failed");
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="app-card p-6">
        <p className="text-sm font-semibold text-rose-600">
          {profileError?.data?.message ||
            profileError?.message ||
            "Profile could not be loaded."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="space-y-6 mt-10">
        <div className="app-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-xl font-extrabold text-white">
              {getInitials(username || email)}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{username}</p>
              <p className="text-sm text-slate-500">{email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-[1.75rem] bg-slate-50 p-5 text-sm text-slate-600">
            <p>
              This preview form saves directly to local storage using the same
              screen structure you can keep for the real integration later.
            </p>
            <p>
              No field validation is enforced here, so you can prototype every
              state quickly.
            </p>
            <p>
              Blank values are fine while you are shaping the UI.
            </p>
          </div>
        </div>

        {loadingUpdateProfile && (
          <div className="app-card flex justify-center p-6">
            <Loader />
          </div>
        )}
      </aside>

      <section className="app-card p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Update profile
        </h1>
        <p className="mt-3 section-copy">
          Everything on this page is stored locally so you can design the full
          profile workflow first.
        </p>

        <form onSubmit={submitHandler} className="mt-8 space-y-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label">Username</label>
              <input
                type="text"
                className="field-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">New password</label>
              <input
                type="password"
                className="field-input"
                placeholder="Leave blank to keep the current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Confirm password</label>
              <input
                type="password"
                className="field-input"
                placeholder="Repeat the new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-lg font-bold text-slate-900">Profile details</p>
              <p className="mt-2 text-sm text-slate-500">
                These fields are persisted in the local preview store.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">First name</label>
                <input
                  type="text"
                  className="field-input"
                  value={profileFields.firstName}
                  onChange={(e) =>
                    handleProfileFieldChange("firstName", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="field-label">Last name</label>
                <input
                  type="text"
                  className="field-input"
                  value={profileFields.lastName}
                  onChange={(e) =>
                    handleProfileFieldChange("lastName", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="field-label">Phone number</label>
                <input
                  type="text"
                  className="field-input"
                  value={profileFields.phoneNumber}
                  onChange={(e) =>
                    handleProfileFieldChange("phoneNumber", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="field-label">Profile picture URL</label>
                <input
                  type="text"
                  className="field-input"
                  value={profileFields.profilePicture}
                  onChange={(e) =>
                    handleProfileFieldChange("profilePicture", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="field-label">Address</label>
              <textarea
                rows="3"
                className="field-input"
                value={profileFields.address}
                onChange={(e) =>
                  handleProfileFieldChange("address", e.target.value)
                }
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">Account details</label>
                <textarea
                  rows="4"
                  className="field-input"
                  value={profileFields.accountDetails}
                  onChange={(e) =>
                    handleProfileFieldChange("accountDetails", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="field-label">Preferences</label>
                <textarea
                  rows="4"
                  className="field-input"
                  value={profileFields.preferences}
                  onChange={(e) =>
                    handleProfileFieldChange("preferences", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <button type="submit" className="primary-button">
            Save changes
          </button>
        </form>
      </section>
    </div>
  );
};

export default Profile;
